import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { WebSocket } from '@fastify/websocket'
import { prisma } from "../../server/prisma.js"
import { drawCard , setGame } from "./start-game.js"
import { joinLobby , codeAlreadyExists , generateGameCode } from "./lobby.js"

/**
 * Fonctionnement des Lobbies :
 * 
 * Lobbies[] stocke toutes les games en attente de lancement, la première
 * case Lobbies[0] est réservée a la Game publique qu'on rejoint en
 * cliquant sur le bouton Join Public Game. Le reste sont les Game créees
 * par les utilisateurs via la génération d'un code aléatoire. 
 * Dès qu'une game est ready (4 joueurs), elle est lancée via la fonction
 * startGame().
 */

interface CreationRequestBody {
  username: string;
}

interface JoinRequestBody {
  username: string;
  code: string;
}

export interface Card {
  name: string;
  value: number;
  nb: number;
}

export interface Stats {
  victory: number
  defeat: number
  // ...
}

export interface Player {
    id: number;
    username: string;
    deck: Card[];
    score: number;
    card: Card | undefined
    stats: Stats
}

export interface Lobby {
  owner: string;
  code: string;
  nb_players: number;
  users: string[];
  ws: Set<WebSocket>;
}

export interface Game {
    owner: string;
    players: Player[];
    discard: Card[];
    ws: Set<WebSocket>    //we use a Set because only unique values
    winner?: Player;
}

//General variables

const games = new Map<string, Game>()

let gameEnd = false


//Creation of arrays Lobbies[] (Game waiting) and Games[] (Games running)
const lobbies: Lobby[] = [{
  owner: "public",
  code: '',
  nb_players: 0,
  users: ["Player1", "Player2", "Player3", "Player4"],
  ws: new Set<WebSocket>()
}];

export function addGame(code: string, game: Game)
{
    games.set(code, game)
}

//Route for private game creation : code generation et setup game variables
//  receive body : {username, websocket}
//  reply game : {owner, status, code, nb_players, users[]}
export async function createGameHTTP(request : FastifyRequest<{Body: CreationRequestBody}>, reply : FastifyReply)
{
  const {username} = request.body
  let code: string = ''
  while (code === '' || codeAlreadyExists(lobbies, code)) {
    code = generateGameCode()
  }

  const lobby: Lobby = {owner: username, code: code, nb_players: 1, users: [username, "Player2", "Player3", "Player4"], ws: new Set<WebSocket>}
  lobbies.push(lobby)
  return reply.status(200).send(lobby);
}

//Route to join a private game : comparison of code
//  receive body : {username, code}
//  reply game : {owner, status, code, nb_players, users[]}
export async function joinGameHTTP(request : FastifyRequest<{Body: JoinRequestBody}>, reply : FastifyReply)
{
  const {username, code} = request.body
  if(!code && lobbies[0].nb_players < 4)                //join public game
  {
    joinLobby(lobbies, lobbies[0], username)
    return reply.status(200).send(lobbies[0]);
  }
  const lobby = lobbies.find(lobby => lobby.code === code)
  if (!lobby)
    return reply.status(404).send({ error: "Game unavailable" })
  joinLobby(lobbies, lobby, username)
  return reply.status(200).send(lobby);
}

function launchGame(lobby : Lobby)
{
  setGame(lobby)
  const index = lobbies.findIndex(lob => lob === lobby)
  if (index === 0)
  {
    const newLobby: Lobby = {owner: "public", code: '', nb_players: 0, users: ["Player1", "Player2", "Player3", "Player4"], ws: new Set<WebSocket>()}
    lobbies.splice(index, 1, newLobby)
  }
  else
    lobbies.splice(index, 1)
}

async function sendStatstoDB(player : Player, game: Game, code: string)
{
  const user = await prisma.user.findUnique({
  where: { username: player.username }
  })
  if (!user)
    return

  const update = await prisma.statsUser.update({
    where: {player_id: user.id},
    data: {
      nb_games: {increment: 1},
      nb_victories: {increment: player.stats.victory},
      nb_defeats: {increment: player.stats.defeat},
  }})
  deleteGame(game, code)
  gameEnd = false
}

function deleteGame(game: Game, code: string)
{
  game.ws.forEach(ws => ws.close())
  games.delete(code)
}

function endGame(message : any)
{
  const code = message.code
  const game = games.get(code)!
  //Find the winner with the biggest score
  game.winner = game.players.reduce((best, current) => 
    current.score > best.score ? current : best)
  game.winner.stats.victory = 1
  game.winner.stats.defeat = 0

  //Broadcast winner's name to all players
  game.ws.forEach(websocket => websocket.send(JSON.stringify({
    type: 'WINNER',
    winner: game.winner, // {id, username, deck, score, card}
   })))

  //Store player's stats and game stats in DB
  game.players.forEach(player => sendStatstoDB(player, game, code))
  
}

function broadcastNewPlayer(lobby : Lobby)
{
  lobby.ws?.forEach(websocket => websocket.send(JSON.stringify({
        type: 'JOIN',
        users: lobby.users,
      })))
  
  if (lobby.nb_players === 4)
  {
    lobby.code = generateGameCode()
    console.log(lobby)
    lobby.ws.forEach(websocket => websocket.send(JSON.stringify({type: 'START', code: lobby.code})))
  }
}

function broadcastDrawnCard(message : any)
{
  const game = games.get(message.code)!
  const player = game.players.find(p => p.username === message.username)!
  game.discard.unshift(drawCard(player))

  //Broadcast
  game.ws.forEach(websocket => websocket.send(JSON.stringify({
    type: 'DRAW',
    player: player, // {id, username, deck, score, card}
  })))
}

function isSandwichCombo(discard: Card[]) : Boolean
{
  if (discard.length < 3)
    return false
  return (discard[0].value === discard[2].value)
}

function isDoubleCombo(discard: Card[]) : Boolean
{
  if (discard.length < 2)
    return false
  return (discard[0].value === discard[1].value)
}

// TO BE COMPLETED
//Analyse discard to verify if smash is good or not
function validSmash(discard: Card[]) : Boolean
{
  if (isDoubleCombo(discard) || isSandwichCombo(discard))
    return true
  return false
}

//Receive message : {type, code, username, cards (3 last)}
function smashManagement(message: any)
{
  let   response : string
  const game = games.get(message.code)!
  const player = game.players.find(p => p.username === message.username)!
  let   trickValue = game.discard.reduce((sum, card) => sum + card.value, 0)

  //Smash verification
  if (validSmash(game.discard))
  {
    player.score += trickValue
    player.deck.push(...game.discard.reverse())
    game.discard = []
    trickValue = 0
    response = 'SUCCESS'
  }
  else if (player.deck.length > 0)
  {
    const card = drawCard(player)
    game.discard.push(card)
    trickValue += card.value
    player.deck.shift()
    response = 'FAIL'
  }

  //Broadcast
  game.ws.forEach(websocket => websocket.send(JSON.stringify({
    type: response,
    player: player, // Player : {id, username, deck, score, card}
    trick: trickValue  // Value of the discard
  })))
}

export function gameSocketRoute(websocket:  WebSocket, request: FastifyRequest)
{
  // MAIN ROAD : when a websocket is declared in front-end. 
  // Add the new WS to the lobby and launch the game if nb_players = 4
  const {code} = request.params as {code: string}
  const lobby = lobbies.find(lobby => lobby.code === code)
  if (!lobby) 
    return websocket.close()
  lobby.ws.add(websocket)
  if (lobby.nb_players === 4)
  {
    launchGame(lobby)
  }
  
  //WEBSOCKET.ON 
  // Defines the behaviour of the new websocket
  websocket.on('message', (data: any) => {
    const message = JSON.parse(data.toString())

    if (message.type === 'JOIN') // message : {type, username}
      broadcastNewPlayer(lobby)

    if (message.type === 'DRAW') // message : {type, code, username}
      broadcastDrawnCard(message)

    if (message.type === 'END' && gameEnd === false)
    {
      gameEnd = true
      endGame(message)
    }

    if (message.type === 'SMASH')
      smashManagement(message)
  })
}
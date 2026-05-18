import { FastifyRequest } from 'fastify'
import { WebSocket } from '@fastify/websocket'
import { launchGame } from "./start-game.js"
import { isValidSmash , winTrick , drawCard , isHead , whichHead, endTrick , findPreviousPlayer , findNextPlayer } from "./game-utils.js"
import { generateGameCode } from "./lobby.js"
import { endGame } from "./end-game.js"

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
    discard_value: number
    ws: Set<WebSocket>    //we use a Set because only unique values
    winner?: Player;
}

//General variables
export const games = new Map<string, Game>()

const TIME : number = 10
let time = TIME
const PENALTY: number = 5

let smash_available = true    //  False after someone smash (to avoid multiple smash). Available when a new card is drawn 
let pos = 0                   //  position of the player who plays
let headOn = false            //  true when game is in "Head Mode"

//Creation of arrays Lobbies[]
export const lobbies: Lobby[] = [{
  owner: "public",
  code: '',
  nb_players: 0,
  users: ["Player1", "Player2", "Player3", "Player4"],
  ws: new Set<WebSocket>()
}];

export function addGame(code: string, game: Game)
{
    games.set(code, game)
    gameRoutine(game)
}
/*
TIMER
Launch the game timer and send time for display
*/
function launchTimer(lobby : Lobby)
{
  time = TIME
  const interval = setInterval(() => {
    time--;
    lobby.ws.forEach(websocket => websocket.send(JSON.stringify({
      type: 'TIME',
      time: time,
    })))
    if (time === 0)
      clearInterval(interval)
  }, 2000);
  time = TIME
}

/*
ROUTINE
Manage cards draw and basic rules of the game : head system, trick win/loss (without smash) 
*/
function gameRoutine(game : Game)
{
  let trickEnd = false
  let head = 0; //counter for number of cards to draw according to Head Type (1, 2, 3 or 4)
  const interval = setInterval(() => {
    //if the trick is over by head system, find the winner position and end trick 
    if (trickEnd == true)
    {
      headOn = false
      pos = findPreviousPlayer(game, pos)
      const winner = game.players[pos % 4]
      endTrick(game, winner)
      trickEnd = false
    }
    else if (head != 0)
      head--

    // draw a new card
    pos = findNextPlayer(game, pos)
    const card = drawCard(game, game.players[pos % 4])
    smash_available = true

    // if card drawed is a head, switch to Head Mode
    if (isHead(card))
    {
      head = whichHead(card)
      headOn = true
    }

    // if player has drawn all his card and no heads : he loose the trick
    if (headOn == true && head == 0)
      trickEnd = true

    // if player has drawn a head : switch to next player
    else if (headOn == false || isHead(card))
      pos++

    // when timer is over : end of the game
    if (time === 0)
    {
      endGame(game)
      clearInterval(interval)
    }
  }, 2000)
}

/*
NEW PLAYER
Send the New Player to all lobby players 
*/
function newPlayerEvent(lobby : Lobby)
{
  lobby.ws?.forEach(websocket => websocket.send(JSON.stringify({
        type: 'JOIN',
        users: lobby.users,
      })))
  
  if (lobby.nb_players === 4)
  {
    lobby.code = generateGameCode()
    launchTimer(lobby);
    lobby.ws.forEach(websocket => websocket.send(JSON.stringify({type: 'START', code: lobby.code})))
  }
}

/*
SMASH
Manage smash events
*/
//Receive message : {type, code, username}
function smashEvent(message: any)
{
  if (smash_available === false)
    return
  
  let   response : string
  const game = games.get(message.code)!
  const player = game.players.find(p => p.username === message.username)!
  
  //Smash verification
  if (isValidSmash(game.discard))
  {
    winTrick(game, player)
    response = 'SUCCESS'
    pos = player.id
    headOn = false
  }
  else
  {
    player.score -= PENALTY
    response = 'FAIL'
  }

  //Broadcast
  game.ws.forEach(websocket => websocket.send(JSON.stringify({
    type: response,
    player: player, // Player : {id, username, deck, score, card}
    discard_value: game.discard_value,  // Value of the discard
    discard: game.discard
  })))
  smash_available = false
}

/*
GAME WEBSOCKET ROUTES
Manage the message received from a front websocket 
*/
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
    launchGame(lobby)
  
  //WEBSOCKET.ON 
  // Defines the behaviour of the new websocket
  websocket.on('message', (data: any) => {
    const message = JSON.parse(data.toString())

    //A new player join the lobby
    if (message.type === 'JOIN') // message : {type, username}
      newPlayerEvent(lobby)

    //A player smash
    if (message.type === 'SMASH') {
      smashEvent(message)
    }
    if (message.type === 'CHATMSG') {
      const content = String(message.content ?? '').trim().slice(0,350)
      if(!content) return

      const currentLobby = lobbies.find(lobby => lobby.code == code)
      const currentGame = games.get(code)
      const target = currentGame ?? currentLobby
      if(!target) return

      const payload = JSON.stringify({
        type: 'CHATMSG',
        username: String(message.username ?? 'unknow'),
        content,
        timestamp: Date.now(),
      })
      target.ws.forEach(ws => ws.send(payload))
    }
  })
}
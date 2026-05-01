import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { WebSocket } from '@fastify/websocket'
import { drawCard } from "./start-game.js"
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

export interface Player {
    username: string;
    deck: Card[];
    score: number;
    card: Card | undefined
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
    ws: Set<WebSocket>    //we use a Set because only unique values
    winner?: Player;
}

//General variables

const games = new Map<string, Game>()

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
export async function createGameRoute(request : FastifyRequest<{Body: CreationRequestBody}>, reply : FastifyReply)
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
export async function joinGameRoute(request : FastifyRequest<{Body: JoinRequestBody}>, reply : FastifyReply)
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


export function gameSocketRoute(websocket:  WebSocket, request: FastifyRequest)
{
  const {code} = request.params as {code: string}
    const lobby = lobbies.find(lobby => lobby.code === code)
    if (!lobby) 
      return websocket.close()
    lobby.ws.add(websocket) //if ws already exists, it is not added (Set)
    
    websocket.on('message', (data: any) => {
        const message = JSON.parse(data.toString())

        if (message.type === 'JOIN') // message : {type, code, username}
        {
          lobby.ws?.forEach(websocket => websocket.send(JSON.stringify({
            type: 'JOIN',
            users: lobby.users,
          })))
        }

        if (message.type === 'DRAW') // message : {type, code, username}
        {
            const game = games.get(code)!
            const player = drawCard(game, message.username)
            //Broadcast
            game.ws.forEach(websocket => websocket.send(JSON.stringify({
              type: 'DRAW',
              player: player
          })))
        }

        // if (message.type === 'SMASH')
    })
}
import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

/**
 * Fonctionnement des Lobbies :
 * 
 * Les games sont stockées dans deux tableaux, Lobbies[] et Games[]
 * 
 * Lobbies[] stocke toutes les games en attente de lancement, la première
 * case Lobbies[0] est réservée a la Game publique qu'on rejoint en
 * cliquant sur le bouton Join Public Game. Le reste sont les Game créees
 * par les utilisateurs via la génération d'un code aléatoire. 
 * Dès qu'une game est ready (4 joueurs), elle est lancée et push dans
 * le tableau Games[]
 * 
 * Games[] stocke toutes les games en cours. Lorsqu'une game se termine,
 * un objet statistiques est envoyé a la base de données pour être stocké
 */


interface CreationRequestBody {
  username: string;
}

interface JoinRequestBody {
  username: string;
  code: string;
}

interface Lobby {
  owner: string;
  code: string;
  nb_players: number;
  users: string[];
}

interface Game {
  owner: string;
  users: string[];
}

//Creation of arrays Lobbies[] (Game waiting) and Games[] (Games running)
const lobbies: Lobby[] = [{
  owner: "public",
  code: '',
  nb_players: 0,
  users: ["Player1", "Player2", "Player3", "Player4"]
}];

const games: Game[] = []


function generateGameCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const nums = "0123456789"
  let code: string = ''
  for (let i = 0; i < 4; i++)
  {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  code += '-'
  for (let i = 0; i < 4; i++)
  {
    code += nums[Math.floor(Math.random() * nums.length)]
  }
  return code
}


function codeAlreadyExists(code: string): boolean
{
  return lobbies.some(lobby => lobby.code === code)
}

//Route for private game creation : code generation et setup game variables
//  receive body : {username}
//  reply game : {owner, status, code, nb_players, users[]}
export async function createGameRoute(request : FastifyRequest<{Body: CreationRequestBody}>, reply : FastifyReply)
{
  const {username} = request.body
  let code: string = ''
  while (code === '' || codeAlreadyExists(code)) {
    code = generateGameCode()
  }

  const lobby: Lobby = {owner: username, code: code, nb_players: 1, users: [username, "Player2", "Player3", "Player4"]}
  lobbies.push(lobby)
  console.log("LOBBIES", lobbies)
  console.log("GAMES", games)
  return reply.status(200).send(lobby);
}


function joinLobby(lobby: Lobby, username: string)
{
  lobby.nb_players += 1
  lobby.users[lobby.nb_players - 1] = username
  if (lobby.nb_players === 4)
  {
    const index = lobbies.findIndex(lob => lob === lobby)
    if (index === 0)
    {
      const newLobby: Lobby = {owner: "public", code: '', nb_players: 0, users: ["Player1", "Player2", "Player3", "Player4"]}
      lobbies.splice(index, 1, newLobby)
    }
    else
      lobbies.splice(index, 1)
    games.push(lobby)
  }
  console.log("LOBBIES", lobbies)
  console.log("GAMES", games)
}


//Route to join a private game : comparison of code
//  receive body : {username, code}
//  reply game : {owner, status, code, nb_players, users[]}
export async function joinGameRoute(request : FastifyRequest<{Body: JoinRequestBody}>, reply : FastifyReply)
{
  const {username, code} = request.body
  if(!code && lobbies[0].nb_players < 4)                //join public game
  {
    joinLobby(lobbies[0], username)
    return reply.status(200).send(games[0]);
  }
  const lobby = lobbies.find(lobby => lobby.code === code)
  if (!lobby)
    return reply.status(404).send({ error: "Game unavailable" })
  joinLobby(lobby, username)
  return reply.status(200).send(lobby);
}

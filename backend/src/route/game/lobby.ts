import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

enum GameStatus {
  WAITING,
  PLAYING,
}

interface CreationRequestBody {
  username: string;
}

interface JoinRequestBody {
  username: string;
  code: string;
}

interface Game {
  owner: string;
  status: GameStatus;
  code: string;
  nb_players: number;
  users: string[];
}

//Creation of games objects array : first element is dedicated to the public room
const games: Game[] = [{
  owner: "public",
  status: GameStatus.WAITING,
  code: '',
  nb_players: 0,
  users: []
}];


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
  return games.some(game => game.code === code)
}

//Route for private game creation : code generation et setup game variables
// body : {username}
export async function createGameRoute(request : FastifyRequest<{Body: CreationRequestBody}>, reply : FastifyReply)
{
  console.log("createGame Request")
  const {username} = request.body
  let code: string = ''
  while (code === '' || codeAlreadyExists(code)) {
    code = generateGameCode()
  }

  const game: Game = {owner: username, status: GameStatus.WAITING, code: code, nb_players: 1, users: [username]}
  games.push(game)
  console.log(games)
  return reply.status(200).send(game);
}


function joinGame(game: Game, username: string)
{
  game.nb_players += 1
  game.users.push(username)
}

//Route to join a private game : comparison of code
// body : {username, code}
export async function joinGameRoute(request : FastifyRequest<{Body: JoinRequestBody}>, reply : FastifyReply)
{
  console.log(games)
  const {username, code} = request.body
  if(!code)                //join public game
  {
    joinGame(games[0], username)
    return reply.status(200).send(games[0]);
  }
  const game = games.find(game => game.code === code)
  if (!game)
  {
    console.log("error: Invalid Code")
    return reply.status(404).send({ error: "Invalid code" })
  }
  else if (game && game.status === GameStatus.PLAYING)
  {
    console.log("error: The game has already started")
    return reply.status(404).send({ error: "The game has already started" })
  }
  else
  {
    joinGame(game, username)
    console.log(game)
    return reply.status(200).send(game);
  }
}

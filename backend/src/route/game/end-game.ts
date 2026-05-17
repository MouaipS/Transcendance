import { prisma } from "../../server/prisma.js"
import { Game , Player } from "./websocket.js"
import { games } from "./websocket.js"


export function deleteGame(game: Game, user : any)
{
  game.ws.forEach(ws => ws.close())
  games.delete(user)
}

export async function sendStatstoDB(player : Player, game: Game)
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
  deleteGame(game, user)
}

export function endGame(game : Game)
{
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
   for (let i = 0; i < 4; i++)
   {
      if (game.players[i].bot == false)
        sendStatstoDB(game.players[i], game)
   }
}
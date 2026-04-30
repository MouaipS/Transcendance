import { setGame } from "./start-game.js"
import { Lobby } from './websocket.js'

export function generateGameCode(): string {
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


export function codeAlreadyExists(lobbies : Lobby[], code: string): boolean
{
  return lobbies.some(lobby => lobby.code === code)
}


export function joinLobby(lobbies : Lobby[], lobby: Lobby, username: string)
{
  lobby.nb_players += 1
  lobby.users[lobby.nb_players - 1] = username
  if (lobby.nb_players === 4)
  {
    const index = lobbies.findIndex(lob => lob === lobby)
    if (index === 0)
    {
      const newLobby: Lobby = {owner: "public", code: '', nb_players: 0, users: ["Player1", "Player2", "Player3", "Player4"], ws: new Set<WebSocket>()}
      lobbies.splice(index, 1, newLobby)
    }
    else
      lobbies.splice(index, 1)
    setGame(lobby)
  }
}






import { Game , Player , Card } from "./websocket.js"
import { endGame } from "./end-game.js"

export function whichHead(card : Card) : number
{
  switch (card.name)
  {
    case "A":
      return 1
    case "B":
      return 2
    case "C":
      return 3
    case "D":
      return 4
  }
  return 0
}

export function isHead(card : Card) : boolean
{
    const regex = /^[A-Z]$/
    return (regex.test(card.name))
}

function isSandwichCombo(discard: Card[]) : Boolean
{
  if (discard.length < 3)
    return false
  return (discard[0].name === discard[2].name)
}

function isDoubleCombo(discard: Card[]) : Boolean
{
  if (discard.length < 2)
    return false
  return (discard[0].name === discard[1].name)
}

// WIP : add combos
//Analyse discard to verify if smash is good or not
export function isValidSmash(discard: Card[]) : Boolean
{
  if (isDoubleCombo(discard) || isSandwichCombo(discard))
    return true
  return false
}

export function winTrick(game : Game , player : Player)
{
    player.score += game.discard_value
    player.deck.push(...game.discard.reverse())
    game.discard = []
    game.discard_value = 0
}

export function drawCard(game : Game, player : Player) : Card
{
  const card = player.deck.shift()!
  player.card = card
  game.discard.unshift(card)
  game.discard_value += card.value

  if (onePlayerAlive(game) && lastPlayerName(game) === player.username)
    endGame(game)
  else
  {
    game.ws.forEach(websocket => websocket.send(JSON.stringify({
      type: 'DRAW',
      player: player, // {id, username, deck, score, card}
      discard_value: game.discard_value,
      discard: game.discard
    })))
  }
  return card
}

export function endTrick(game : Game, winner : Player)
{
  winTrick(game, winner)

  //Broadcast
  game.ws.forEach(websocket => websocket.send(JSON.stringify({
    type: 'SUCCESS',
    player: winner, // Player : {id, username, deck, score, card}
    discard_value: 0,  // Value of the discard
    discard: game.discard
  })))
}

export function findPreviousPlayer(game : Game, pos : number) : number
{
  pos += 3
  while (game.players[pos % 4].deck.length <= 0)
    pos += 3;
  return pos
}

export function findNextPlayer(game : Game, pos : number) : number
{
  while (game.players[pos % 4].deck.length <= 0)
      pos++;
  return pos
}

// export function applyCardMalus(game : Game, player : Player)
// {
//     const card = player.deck.shift()!
//     player.card = card
//     game.discard.push(card)
//     game.discard_value += card.value
// }

export function onePlayerAlive(game : Game) : Boolean
{
  const playersAlive = game.players.filter(player => player.deck.length !== 0)
  return playersAlive.length === 1
}

export function lastPlayerName(game: Game) : String
{
  const lastPlayer = game.players.filter(player => player.deck.length !== 0)
  return lastPlayer[0].username
}

export function randomInt(min : number , max : number) : number
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
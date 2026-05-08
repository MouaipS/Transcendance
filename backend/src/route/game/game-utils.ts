import { Game , Player , Card } from "./websocket.js"


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

export function applyCardMalus(game : Game, player : Player)
{
    const card = player.deck.shift()!
    player.card = card
    game.discard.push(card)
    game.discard_value += card.value
    player.deck.shift()
}
import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import { Lobby } from "./lobby.js"

interface Card {
  name: string;
  value: number;
  nb: number;
}

interface Player {
    username: string;
    deck: Card[];
    score: number;
    card: Card | undefined
}

interface Game {
    owner: string;
    players: Player[];
    winner?: Player;
    //code: string;
}

interface PlayerBody {
  username: string;
  code: string;
}

//General variables

const games = new Map<string, Game>()

const DECK_CONFIG: Card[] = [
    {name:"1", value: 1, nb: 14},
    {name:"2", value: 2, nb: 14},
    {name:"3", value: 3, nb: 14},
    {name:"4", value: 4, nb: 14},
    {name:"5", value: 5, nb: 14},
    {name:"6", value: 6, nb: 14},
    {name:"7", value: 7, nb: 14},
    {name:"8", value: 8, nb: 14},
    {name:"9", value: 9, nb: 14},
    {name:"10", value: 10, nb: 14},
    {name:"11", value: 11, nb:  7},
    {name:"12", value: 12, nb:  7},
    {name:"13", value: 13, nb:  7},
    {name:"14", value: 14, nb:  7},
]

function createSuperDeck(): Card[]
{
    const superDeck: Card[] = []
    const shufDeck: Card[] = []

    //Creation of a super deck with all cards
    for (const {name, value, nb} of DECK_CONFIG)
    {
        for(let i = 0; i < nb; i++)
        {
            superDeck.push({name, value, nb})
        }
    }

    //Shuffle
    while (superDeck.length > 0)
    {
        const randomIndex = Math.floor(Math.random() * superDeck.length)
        const [card] = superDeck.splice(randomIndex, 1)
        shufDeck.push(card)
    }
    return shufDeck
}

function buildDecks(): Card[][]
{
    const superDeck: Card[] = createSuperDeck()
    const deckSize = Math.floor(superDeck.length / 4)

    const decks: Card[][] = [
        superDeck.slice(0, deckSize),
        superDeck.slice(deckSize, deckSize * 2),
        superDeck.slice(deckSize * 2, deckSize * 3),
        superDeck.slice(deckSize * 3, deckSize * 4)
    ]

    return decks
}

// Draw the first card of player's deck
//  receive body : {username, code}
//  reply body: {username, score, nb_cards, card_name, card_value}
export async function drawCardsRoute(request : FastifyRequest<{Body: PlayerBody}>, reply : FastifyReply)
{
    const {code, username} = request.body
    const game: Game | undefined = games.get(code)
    if(!game)
        return reply.status(404).send("Error: Game unavailable")
    const player: Player | undefined = game.players.find(p => p.username === username)
    if(!player)
        return reply.status(404).send("Error: Player doesn't exist")
    if (player.deck.length === 0)
        return reply.status(404).send(player.username + "'s deck is empty")
    player.card = player.deck.shift()
    if (!player.card)
        return reply.status(404).send(player.username + "'s deck is empty")
    player.score += player.card.value    
    return reply.status(200).send({
        username: player.username,
        score: player.score,
        nb_card: player.deck.length,
        card_name: player.card.name,
        card_value: player.card.value
    })
}

export function startGame(lobby: Lobby)
{
    const decks: Card[][] = buildDecks()

    const p1: Player = {username:lobby.users[0], deck: decks[0], score: 0, card: undefined}
    const p2: Player = {username:lobby.users[1], deck: decks[1], score: 0, card: undefined}
    const p3: Player = {username:lobby.users[2], deck: decks[2], score: 0, card: undefined}
    const p4: Player = {username:lobby.users[3], deck: decks[3], score: 0, card: undefined}

    const game: Game = {owner: lobby.owner, players: [p1, p2, p3, p4]}
    games.set(lobby.code, game)
}
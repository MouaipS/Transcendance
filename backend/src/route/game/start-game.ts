import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import { Lobby } from "./lobby.js"


interface Player {
    username: string;
    deck: string[];
    score: number;
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

const DECK_CONFIG: Array<[string, number]> = [
    ["1", 14],
    ["2", 14],
    ["3", 14],
    ["4", 14],
    ["5", 14],
    ["6", 14],
    ["7", 14],
    ["8", 14],
    ["9", 14],
    ["10", 14],
    ["11", 7],
    ["12", 7],
    ["13", 7],
    ["14", 7],
]

function createSuperDeck(): string[]
{
    const superDeck: string[] = []
    const shufDeck: string[] = []

    //Creation of a super deck with all cards
    for (const [val, nb] of DECK_CONFIG)
    {
        for(let i = 0; i < nb; i++)
        {
            superDeck.push(val)
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

function buildDecks(): string[][]
{
    const superDeck: string[] = createSuperDeck()
    const deckSize = Math.floor(superDeck.length / 4)

    const decks: string[][] = [
        superDeck.slice(0, deckSize),
        superDeck.slice(deckSize, deckSize * 2),
        superDeck.slice(deckSize * 2, deckSize * 3),
        superDeck.slice(deckSize * 3, deckSize * 4)
    ]

    return decks
}

// Draw the first card of player's deck
//  receive body : {username, code}
//  reply : card (string with value inside)
export async function drawCardsRoute(request : FastifyRequest<{Body: PlayerBody}>, reply : FastifyReply)
{
    const {code, username} = request.body
    const game: Game = games.get(code)!     //non-null assertion : game is never undefined
    const player = game.players.find(p => p.username === username)!
    const card: string = player.deck.shift()!

    return reply.status(200).send(card)
}

export function startGame(lobby: Lobby)
{
    const decks: string[][] = buildDecks()

    const p1: Player = {username:lobby.users[0], deck: decks[0], score: 0}
    const p2: Player = {username:lobby.users[1], deck: decks[1], score: 0}
    const p3: Player = {username:lobby.users[2], deck: decks[2], score: 0}
    const p4: Player = {username:lobby.users[3], deck: decks[3], score: 0}

    const game: Game = {owner: lobby.owner, players: [p1, p2, p3, p4]}
    games.set(lobby.code, game)
}
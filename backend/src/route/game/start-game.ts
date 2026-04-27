import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { WebSocket } from '@fastify/websocket'
import { RawData } from 'ws'
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
    ws: Set<WebSocket>    //we use a Set because only unique values
    winner?: Player;
}

interface PlayerBody {
  username: string;
  code: string;
}

//General variables

const games = new Map<string, Game>()

const DECK_CONFIG: Card[] = [
    {name:"1", value: 1, nb: 3},
    {name:"2", value: 2, nb: 3},
    {name:"3", value: 3, nb: 3},
    {name:"4", value: 4, nb: 3},
    {name:"5", value: 5, nb: 3},
    {name:"6", value: 6, nb: 3},
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

//Draw the first card and broadcast informations to all websockets registered
//  {typeOfEvent, username, score updated, nb_cards, cardName, cardValue}
function drawCard(game: Game, username: string)
{
    const player: Player | undefined = game.players.find(p => p.username === username)
    if(!player)
        return
    if (player.deck.length === 0)
        return
    const card = player.deck.shift()
    if (!card)
        return
    player.card = card
    player.score += card.value    
    
    game.ws.forEach(websocket => websocket.send(JSON.stringify({
        type: 'DRAW',
        username: player.username,
        score: player.score,
        nb_card: player.deck.length,
        card_name: card.name,
        card_value: card.value
    })))
}

// This road is used when Front-End create a New Websocket
// Websocket must receive a raw message {"type", "username"} + game code in URL
//  type: type of event ("DRAW", "SMASH", etc)
export function gameSocketRoute(websocket: WebSocket, request: FastifyRequest)
{
    const {code} = request.params as {code: string}
    const game = games.get(code)!
    game.ws.add(websocket) //if ws already exists, it is not added (Set)

    websocket.on('message', (raw: RawData) => {
        const message = JSON.parse(raw.toString())

        if (message.type === 'DRAW')
            drawCard(game, message.username)
    })
}

//receive Lobby {owner: string; code: string; nb_players: number; users: string[];}
//  -> set a game instance in the games Map <code, Game>
export function startGame(lobby: Lobby)
{
    const decks: Card[][] = buildDecks()

    const p1: Player = {username:lobby.users[0], deck: decks[0], score: 0, card: undefined}
    const p2: Player = {username:lobby.users[1], deck: decks[1], score: 0, card: undefined}
    const p3: Player = {username:lobby.users[2], deck: decks[2], score: 0, card: undefined}
    const p4: Player = {username:lobby.users[3], deck: decks[3], score: 0, card: undefined}

    const game: Game = {
        owner: lobby.owner,
        players: [p1, p2, p3, p4],
        ws: new Set()
    }

    games.set(lobby.code, game)
}
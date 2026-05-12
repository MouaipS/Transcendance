import { Game, Player , Card, Lobby , addGame} from "./websocket.js"

//GLOBAL VARIABLES

const DECK_CONFIG: Card[] = [
    {name:"1", value: 1, nb: 4},
    {name:"2", value: 2, nb: 4},
    {name:"3", value: 3, nb: 4},
    {name:"4", value: 4, nb: 4},
    {name:"A", value: 1, nb: 2},
    {name:"B", value: 1, nb: 2},
    {name:"C", value: 1, nb: 2},
    {name:"D", value: 1, nb: 2},
]

export const PENALTY: number = 5



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

//receive Lobby {owner: string; code: string; nb_players: number; users: string[]; ws: set<ws>}
//  -> set a game instance in the games Map <code, Game>
export function setGame(lobby: Lobby)
{
    const decks: Card[][] = buildDecks()

    const p1: Player = {id: 0, username:lobby.users[0], deck: decks[0], score: 0, card: undefined, stats: {victory: 0, defeat: 1}}
    const p2: Player = {id: 1, username:lobby.users[1], deck: decks[1], score: 0, card: undefined, stats: {victory: 0, defeat: 1}}
    const p3: Player = {id: 2, username:lobby.users[2], deck: decks[2], score: 0, card: undefined, stats: {victory: 0, defeat: 1}}
    const p4: Player = {id: 3, username:lobby.users[3], deck: decks[3], score: 0, card: undefined, stats: {victory: 0, defeat: 1}}

    const game: Game = {
        owner: lobby.owner,
        players: [p1, p2, p3, p4],
        discard: [],
        discard_value: 0,
        ws: lobby.ws
    }
    addGame(lobby.code, game)
}
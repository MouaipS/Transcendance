import { Game, Player , Card, Lobby , addGame} from "./websocket.js"

interface PlayerBody {
  username: string;
  code: string;
}



const DECK_CONFIG: Card[] = [
    {name:"1", value: 1, nb: 3},
    {name:"2", value: 2, nb: 3},
    {name:"3", value: 3, nb: 3},
    {name:"4", value: 4, nb: 3},
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
export function drawCard(game : Game, username: string) : Player | undefined
{
    console.log('player who draw', username)
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
    return player
}

//receive Lobby {owner: string; code: string; nb_players: number; users: string[]; ws: set<ws>}
//  -> set a game instance in the games Map <code, Game>
export function setGame(lobby: Lobby)
{
    console.log("setGame")
    const decks: Card[][] = buildDecks()

    const p1: Player = {id: 0, username:lobby.users[0], deck: decks[0], score: 0, card: undefined}
    const p2: Player = {id: 1, username:lobby.users[1], deck: decks[1], score: 0, card: undefined}
    const p3: Player = {id: 2, username:lobby.users[2], deck: decks[2], score: 0, card: undefined}
    const p4: Player = {id: 3, username:lobby.users[3], deck: decks[3], score: 0, card: undefined}

    const game: Game = {
        owner: lobby.owner,
        players: [p1, p2, p3, p4],
        ws: lobby.ws
    }
    console.log(game)
    addGame(lobby.code, game)
}
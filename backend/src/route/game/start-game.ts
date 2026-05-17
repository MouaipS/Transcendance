import { codeAlreadyExists } from "./lobby.js"
import { Game, Player , Card, Lobby , addGame} from "./websocket.js"
import { lobbies } from "./websocket.js"

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

function randomBotName() : string
{
    let     botName: string = "Bot"
    const   nums = "0123456789"

    for (let i = 0; i < 5; i++)
    {
        botName += nums[Math.floor(Math.random() * nums.length)]
    }
    return botName
}

function    createPlayers(lobby : Lobby, decks : Card[][]) : Player[]
{
    const players: Player[] = []
    let i = 0
    while (i < lobby.nb_players)
    {  
        const player: Player = {
            id: i,
            bot: false,
            username: lobby.users[i],
            deck: decks[i],
            score: 0,
            card: undefined,
            stats: {victory: 0, defeat: 1},
            ws: lobby.ws[i]
        }
        players.push(player)
        i++
    }
    
    //if room not full, fill with bots
    while (lobby.nb_players < 4)
    {
        const player: Player = {
            id: i,
            bot: true,
            username: randomBotName(),
            deck: decks[i],
            score: 0,
            card: undefined,
            stats: {victory: 0, defeat: 1},
            ws: undefined
        }
        players.push(player)
        i++
    }
    return players
}

//receive Lobby {owner: string; code: string; nb_players: number; users: string[]; ws: set<ws>}
//  -> set a game instance in the games Map <code, Game>
export function setGame(lobby: Lobby)
{
    const decks: Card[][] = buildDecks()
    
    const game: Game = {
        owner: lobby.owner,
        code: lobby.code,
        players: createPlayers(lobby, decks),
        discard: [],
        discard_value: 0,
        ws: lobby.ws
    }
    addGame(lobby.code, game)
}

export function launchGame(lobby : Lobby)
{
  setGame(lobby)
  const index = lobbies.findIndex(lob => lob === lobby)
  if (index === 0)
  {
    const newLobby: Lobby = {owner: "public", code: '', nb_players: 0, users: ["Player1", "Player2", "Player3", "Player4"], ws: []}
    lobbies.splice(index, 1, newLobby)
  }
  else
    lobbies.splice(index, 1)
}
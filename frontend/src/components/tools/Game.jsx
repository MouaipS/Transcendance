import { useState, useEffect, useRef, use } from "react";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { GameBoard } from "./GameBoard.jsx"
import { Lobby } from "./Lobby.jsx";
import { useGameSocket } from "./useGameSocket.jsx";


const deck = [
  { name: "1", src: "src/components/images/card1.png" },
  { name: "2", src: "src/components/images/card2.png" },
  { name: "3", src: "src/components/images/card3.png" },
  { name: "4", src: "src/components/images/card4.png" },
  { name: "5", src: "src/components/images/card5.png" },
  { name: "6", src: "src/components/images/card6.png" },
  { name: "A", src: "src/components/images/cardA.png" },
  { name: "B", src: "src/components/images/cardB.png" },
  { name: "C", src: "src/components/images/cardC.png" },
  { name: "D", src: "src/components/images/cardD.png" },
]

let cards = []

const queryClient = new QueryClient()

export function Game () {
	
	const [page, setPage] = useState(0)
	const [code, setCode] = useState('')
  const [username, setUsername] = useState('Michel')
  const [players, setPlayers] = useState([])
  const [decks, setDecks] = useState([6, 6, 6, 6])
  const [score, setScore] = useState([0, 0, 0, 0])
  const [timer, setTimer] = useState(0)
  const [winner, setWinner] = useState('Michel')
  const [end, setEnd] = useState(false)
  const [smasher, setSmasher] = useState('Michel')
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [discard, setDiscard] = useState(0)
  const [player, setPlayer] = useState(0)

  const socketRef = useRef(null)

  useEffect(() => {
  
    const fetchProfile = async () => {

      fetch('/api/home',
      {
        method: "GET",
        credentials: "include"
      })
      .then ((Response) => {
        if (Response.status === 401) 
        {
          console.log("non ", Response.status);
        }
        const data = Response.json();
        return data;           
      })
      .then ((data) => {
        setUsername(data.username)
      })
      .catch ((err) => { 
        console.error("error:", err)
      })
    }

    fetchProfile()
  }, []);

  const { connect } = useGameSocket(socketRef, {
    code, username, cards, deck,
    setPlayers, setDecks, setScore, setTimer,
    setDiscard, setPlayer, setPage, setSmasher,
    setFail, setSuccess, setWinner, setEnd
  })  

  const handleJoin = async (e) => {

    if (e)
      e.preventDefault()
    const body = { username, code }

    const response = await fetch('/api/game/join',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (data.error === 'Game unavailable')
      return

    setPlayers(data.users)

    connect()
  }

  const handleCreate = async (e) => {

    if (e)
      e.preventDefault()
    const response = await fetch('/api/game/create',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username})
    })

    const data = await response.json()

    setCode(data.code)
    setPlayers(data.users)

    connect()
  }

  useEffect(() => {
    const detectKeyUp = (e) => {
      if (e.key === " ")
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: 'SMASH', code, username }))
        }
    }

    document.addEventListener('keyup', detectKeyUp, true)

    return () => {
      document.removeEventListener('keyup', detectKeyUp, true)
    }
  }, [username])


  const Replay = () => {

    setPlayer(0)
    setEnd(false)
    setPlayers([])
    setDecks([6, 6, 6, 6])

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ 
        type: 'JOIN', 
        username: username, 
        code: ''
      }))
    } 
    else {
      handleJoin(); 
    }
  }

  useEffect(() => {

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  const angle = player * 90 + 180
  const gameState = { players, code, timer, decks, score, cards, discard, end, fail, success, angle, smasher, winner, player, Replay }

	return <>
		{page === 0 && 
      <Lobby
        handleJoin={handleJoin}
        handleCreate={handleCreate}
        code={code}
        setCode={setCode}
      />}

    {page === 1 && <GameBoard gameState={gameState}/>}
	</>
}
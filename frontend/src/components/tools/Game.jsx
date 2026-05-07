import { useState, useEffect, useRef, use } from "react";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


const deck = [
  { nb: 1, src: "src/components/images/card1.png" },
  { nb: 2, src: "src/components/images/card2.png" },
  { nb: 3, src: "src/components/images/card3.png" },
  { nb: 4, src: "src/components/images/card4.png" },
  { nb: 5, src: "src/components/images/card5.png" },
  { nb: 6, src: "src/components/images/card6.png" },
]

let cards = []

const queryClient = new QueryClient()

export function Game () {
	
	const [page, setPage] = useState(0)
	const [code, setCode] = useState('')
  const [username, setUsername] = useState('Michel')
  const [players, setPlayers] = useState()
  const [decks, setDecks] = useState([3, 3, 3, 3])
  const [score, setScore] = useState([0, 0, 0, 0])
  const [start, setStart] = useState(false)
  const [index, setIndex] = useState(0)
  const [timer, setTimer] = useState(10)
  const [winner, setWinner] = useState("Michel")
  const [starting, setStarting] = useState(false)
  const [timerStart, setTimerStart] = useState(3)
  const [end, setEnd] = useState(false)

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


  const handleJoin = async (e) => {

    e.preventDefault()
    const body = { username, code }

    const response = await fetch('/api/game/join',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    console.log(data)

    if (data.error === 'Game unavailable')
      return

    setPlayers(data.users)

    const socket = new WebSocket(`ws/game/${code}`)
    socket.onopen = () => {
      socket.send(JSON.stringify({type: 'JOIN', data: username }))
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'JOIN') {
        setPlayers(data.users)
      }

      if (data.type === 'START') {
        //setCode(data.code)
        setStarting(true)
      }
      
      if (data.type === 'DRAW') {
        
        console.log (data)

        let newNumber = 0
        while (newNumber !== data.player.id)
          newNumber++
        
        setDecks((prevDecks) => {
          const newDecks = [...prevDecks]
          newDecks[newNumber] = data.player.deck.length
          return newDecks
        })

        setScore((prevScore) => {
          const newScore = [...prevScore]
          newScore[newNumber] = data.player.score
          return newScore
        })
        
        if (cards.length === 3)
          cards.shift()

        if (cards.length === 0)
        {
          cards.push("")
          cards.push("")
        }

        cards.push(deck[data.player.card.value - 1].src)

      }

      if (data.type === 'WINNER') {
        while (cards.length > 0)
          cards.shift()
        setWinner(data.winner.username)
        setEnd(true)
      }
    }

    socketRef.current = socket
    setPage(1)
  }

  const handleCreate = async (e) => {

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

    const socket = new WebSocket(`ws/game/${data.code}`)
    
    socket.onopen = () => {
      socket.send(JSON.stringify({type: 'CREATE'}))
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'JOIN') {
        setPlayers(data.users)
      }

      if (data.type === 'DRAW') {

        console.log(data)

        let newNumber = 0
        while (newNumber !== data.player.id)
          newNumber++
        
        setDecks((prevDecks) => {
          const newDecks = [...prevDecks]
          newDecks[newNumber] = data.player.deck.length
          return newDecks
        })

        setScore((prevScore) => {
          const newScore = [...prevScore]
          newScore[newNumber] = data.player.score
          return newScore
        })
        
        if (cards.length === 3)
          cards.shift()

        if (cards.length === 0)
        {
          cards.push("")
          cards.push("")
        }

        cards.push(deck[data.player.card.value - 1].src)

      }

      if (data.type === 'WINNER') {
        while (cards.length > 0)
          cards.shift()
        setWinner(data.winner.username)
        setEnd(true)
        if (cards.length != 0)
          cards.shift()
      }
    }

    socketRef.current = socket
    setPage(1)
  }

  useEffect(() => {

    if (!starting) return

    const intervalId = setInterval ( () => {
     
      setTimerStart(prev => prev - 1)

      if (timerStart === 0)
      {
        setStart(true)
        setStarting(false)
        return
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [starting, timerStart])


  const timerRef = useRef(10)
  const intervalRef = useRef(null)

  useEffect(() => {

    if (!start) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    timerRef.current = 10
    setTimer(10)
    setIndex(0)

    intervalRef.current = setInterval(() => {

      timerRef.current -= 1

      if (timerRef.current <= -1) {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: 'END', code }))
        }
        setStart(false)
        clearInterval(intervalRef.current)
        return
      }

      setIndex((prevIndex) => {
        const currIdx = prevIndex % 4
       
        if (decks[currIdx] !== 0 && players[currIdx] === username) {
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'DRAW', username, code }))
          }
        }
        return prevIndex + 1
      })

      setTimer(timerRef.current)

    }, 1000)

    return () => {
      if (intervalRef.current)
        clearInterval(intervalRef.current)
    }
  }, [start, code, username])


  useEffect(() => {

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])


	return <>
		{page === 0 && 
<div className="flex flex-col gap-30 px-8 py-12 max-w-2xl mx-auto h-full justify-center">
      <button 
				className=" bg-amber-300 px-8 py-6 text-stone-900 font-caprasimo text-3xl uppercase tracking-[0.2em] 
                    border-2 border-stone-900 shadow-[4px_4px_0_0_rgba(28,25,23,1)] hover:bg-amber-400 hover:-translate-y-1 
                    hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)] active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(28,25,23,1)]
                    transition-all"
				onClick={handleJoin}>
				JOIN PUBLIC GAME
			</button>

      <form 
        className=" bg-amber-50 px-8 py-6 border-2 border-stone-900shadow-[4px_4px_0_0_rgba(28,25,23,1)]hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)]
                    transition-all flex flex-col items-center gap-4"
        onSubmit={handleJoin}>
          <span className=" font-caprasimo text-2xl uppercase tracking-[0.2em] 
                            text-stone-900">
            JOIN PRIVATE GAME
          </span>
        <div className="flex items-end gap-2 mb-1">
          <span className=" text-[10px] uppercase tracking-[0.3em] 
                            font-bold text-stone-700 pb-1">
            CODE :
            </span>
        <input
          id="code"
          name="code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXXXXXXX"
          className=" text-center bg-amber-100/60 
                      border-2 border-stone-900 px-3 py-1.5 text-xl font-mono tracking-[0.3em] text-stone-900placeholder:text-stone-400 focus:bg-amber-100 
                      focus:outline-none w-48"
          />
        </div>
        <button 
            type="submit"
            className=" bg-stone-900 px-5 py-1.5 
                        text-amber-50 text-xs font-bold uppercase tracking-[0.3em]
                        border-2 border-stone-900
                        hover:bg-stone-800 hover:-translate-y-0.5 transition-all">
            Rejoindre
        </button>
      </form>

			<button 
				className=" bg-stone-900 px-8 py-6 text-amber-50 font-caprasimo text-3xl uppercase tracking-[0.2em] 
                    border-2 border-stone-900 shadow-[4px_4px_0_0_rgba(28,25,23,1)]hover:bg-stone-800 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)]
                    active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(28,25,23,1)]
                    transition-all"
        onClick={handleCreate}>
				CREATE GAME
			</button>
		</div>
    }

    {page === 1 && 
    <div className="flex flex-col">
      <p className="px-5 py-5 absolute text-2xl font-semibold">{code}</p>

      <p className="px-10 py-20 absolute">{timer}</p>

      <div dir="ltr" className="px-120 flex py-5">
        <button
          className="flex items-center gap-6 rounded-md 
          border border-black shadow-md bg-white 
          text-sm font-medium text-gray-700 mt-6
          focus:outline-none min-w-40 max-h-14.5"
        >
          <img
            alt="avatar par défaut"
            src="src/components/images/default_avatar.webp"
            className="h-14 w-14 object-cover rounded-s-lg"
          />
          <span className="pr-4 text-2xl">{players[0]}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <img
            alt="paquet de cartes"
            src="src/components/images/paquet_top.png"
            className="h-30"
          />
          
          <span className="absolute text-white font-bold text-2xl shadow-sm">
            {decks[0]}
          </span>
        </div>

        <div>{score[0]}</div>
      </div>

      <div dir="ltr" className="flex justify-between w-full px-4 mt-15">
        <div className="mt-15">
          <button
            className="flex items-center gap-6 rounded-md 
            border border-black shadow-md bg-white 
            text-sm font-medium text-gray-700 
            focus:outline-none mt-5 min-w-40 max-h-14.5"
          >
            <img
              alt="avatar par défaut"
              src="src/components/images/default_avatar.webp"
              className="h-14 w-14 object-cover rounded-s-lg"
            />
            <span className="pr-4 text-2xl">{players[3]}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <img
              alt="paquet de cartes"
              src="src/components/images/paquet_left.png"
              className="h-20"
            />
            
            <span className="absolute text-white font-bold text-2xl shadow-sm">
              {decks[3]}
            </span>
          </div>
          <div>{score[3]}</div>
        </div>
        
        <img
          src={cards[0]}
          className="h-80 rotate-50"
        />

        <img
          src={cards[1]}
          className="h-80 rotate-20 absolute px-140"
        />

        <img
          src={cards[2]}
          className="h-80 absolute px-140"
        />

        {end && <p className="absolute px-120 py-30 text-4xl">{winner.toUpperCase()} A GAGNÉ !!!</p>}

        {starting && <p className="absolute px-120 py-30 text-3xl">LA PARTIE COMMENCE DANS {timerStart} SECONDES</p>}

        <div className="mt-15">
          <button
            className="flex items-center gap-6 rounded-md 
            border border-black shadow-md bg-white 
            text-sm font-medium text-gray-700
            focus:outline-none mt-5 min-w-40 max-h-14.5"
          >
            <img
              alt="avatar par défaut"
              src="src/components/images/default_avatar.webp"
              className="h-14 w-14 object-cover rounded-s-lg"
            />
            <span className="pr-4 text-2xl">{players[1]}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <img
              alt="paquet de cartes"
              src="src/components/images/paquet_right.png"
              className="h-20"
            />
            
            <span className="absolute text-white font-bold text-2xl shadow-sm">
              {decks[1]}
            </span>
          </div>
          <div>{score[1]}</div>
        </div>
      </div>

      <div dir="ltr" className="px-120 flex mt-30">
        <button
          className="flex items-center gap-6 rounded-md 
          border border-black shadow-md bg-white 
          text-sm font-medium text-gray-700 
          focus:outline-none mt-10 min-w-40 max-h-14.5"
        >
          <img
            alt="avatar par défaut"
            src="src/components/images/default_avatar.webp"
            className="h-14 w-14 object-cover rounded-s-lg"
          />
          <span className="pr-4 text-2xl">{players[2]}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <img
            alt="paquet de cartes"
            src="src/components/images/paquet_bottom.png"
            className="h-30"
          />
          
          <span className="absolute text-white font-bold text-2xl shadow-sm">
            {decks[2]}
          </span>
        </div>
        <div>{score[2]}</div>
      </div>

    </div>

    }
	</>
}
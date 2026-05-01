import { useState, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


let cards = ["src/components/images/Dragon.webp",
   "src/components/images/angel.jpg",
   "src/components/images/varudras.png" 
  ]

const queryClient = new QueryClient()

export function Game () {
	
	const [page, setPage] = useState(0)
	const [code, setCode] = useState('')
  const [username, setUsername] = useState('Michel')
  const [number, setNumber] = useState(0)
  const [players, setPlayers] = useState()
  const [decks, setDecks] = useState([20, 20, 20, 20])
  const [score, setScore] = useState([0, 0, 0, 0])
  const [start, setStart] = useState(false)
  const [timer, setTimer] = useState(0)
  const [index, setIndex] = useState(0)

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

    fetchProfile();
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

      if (data.type === 'DRAW') {

        let i
        while (players[i] === data.username && i < 4)
          i++

        setDecks((prevDecks) => {
          const newDecks = [...prevDecks]
          newDecks[i] = data.deck.length
          return newDecks
        })

        setScore((prevScore) => {
          const newScore = [...prevScore]
          newScore[i] = data.score
          return newScore
        })
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

    //console.log(data)

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

        let i
        while (players[i] === data.username && i < 4)
          i++

        setDecks((prevDecks) => {
          const newDecks = [...prevDecks]
          newDecks[i] = data.deck.length
          return newDecks
        })

        setScore((prevScore) => {
          const newScore = [...prevScore]
          newScore[i] = data.score
          return newScore
        })
      }
    }

    socketRef.current = socket
    setPage(1)
  }

  useEffect(()=> {

    if (!start) return

    const intervalId = setInterval( () => {
      
      // setDecks((prevDecks) => {
      //   const newDecks = [...prevDecks]
      //   newDecks[index % 4] = newDecks[index % 4] - 1
      //   return newDecks
      // })
    
      // const card = cards[0]
      // cards.shift()
      // cards.push(card)
    
      // setIndex(prev => prev + 1)

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)
        socketRef.current.send(JSON.stringify({ type: 'DRAW' }))
      else
        console.error("Le socket n'est pas connecté.")
      
    }, 1000)
    
    return () => clearInterval(intervalId)
  }, [start])

  useEffect(() => {

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])


	return <>
		{page === 0 && 
		<div className="flex flex-col px-120 py-12">
			<button 
				className="flex justify-center rounded-md mt-30 min-h-20
				bg-green-400 font-semibold text-3xl items-center
				hover:bg-green-300 focus-visible:outline-2 mb-10
				focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
				border border-black shadow-md hover:shadow-none 
				hover:inset-shadow-xs hover:inset-shadow-black/50"
				onClick={handleJoin}>
				JOIN PUBLIC GAME
			</button>

      <form 
        className="items-center py-5 rounded-md text-3xl justify-center 
        text-center border bg-yellow-300 font-semibold"
        onSubmit={handleJoin}>
        JOIN PRIVATE GAME
        <input
          id="code"
          name="code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXXXXXXX"
          className="mt-4 block w-full text-center rounded-md bg-white mx-13
            outline-1 -outline-offset-1 outline-black py-3 text-2xl max-w-70
          placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2"
        />
      </form>

			<button 
				className="flex justify-center rounded-md mt-10 min-h-20
				bg-red-400 font-semibold text-3xl items-center
				hover:bg-yellow-300 focus-visible:outline-2 
				focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
				border border-black shadow-md hover:shadow-none 
				hover:inset-shadow-xs hover:inset-shadow-black/50"
        onClick={handleCreate}>
				CREATE GAME
			</button>
		</div>
    }

    {page === 1 && 
    <div className="flex flex-col">
      <p className="px-5 py-5 absolute text-2xl font-semibold">{code}</p>

      <p className="px-10 py-20 absolute" onClick={() => setStart(!start)}>start</p>

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
            <span className="pr-4 text-2xl">{players[1]}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <img
              alt="paquet de cartes"
              src="src/components/images/paquet_left.png"
              className="h-20"
            />
            
            <span className="absolute text-white font-bold text-2xl shadow-sm">
              {decks[1]}
            </span>
          </div>
          <div>{score[1]}</div>
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
              src="src/components/images/paquet_right.png"
              className="h-20"
            />
            
            <span className="absolute text-white font-bold text-2xl shadow-sm">
              {decks[3]}
            </span>
          </div>
          <div>{score[3]}</div>
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
import { useState, useEffect, useRef, use } from "react";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


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
  const [players, setPlayers] = useState()
  const [decks, setDecks] = useState([6, 6, 6, 6])
  const [score, setScore] = useState([0, 0, 0, 0])
  const [start, setStart] = useState(false)
  const [index, setIndex] = useState(0)
  const [timer, setTimer] = useState(30)
  const [winner, setWinner] = useState("Michel")
  const [starting, setStarting] = useState(false)
  const [timerStart, setTimerStart] = useState(3)
  const [end, setEnd] = useState(false)
  const [pause, setPause] = useState(false)
  const [smasher, setSmasher] = useState('Michel')
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [discard, setDiscard] = useState()
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
      console.log (data)

      if (data.type === 'JOIN') {
        setPlayers(data.users)
      }

      if (data.type === 'START') {
        //setCode(data.code)
        setStarting(true)
      }
      
      if (data.type === 'DRAW') {
        
        setDecks((prevDecks) => {
          const newDecks = [...prevDecks]
          newDecks[data.player.id] = data.player.deck.length
          return newDecks
        })

        setDiscard(data.discard_value)

        setScore((prevScore) => {
          const newScore = [...prevScore]
          newScore[data.player.id] = data.player.score
          return newScore
        })

        setPlayer(data.player.id)
        
        if (cards.length === 3)
          cards.shift()

        if (cards.length === 0)
        {
          cards.push("")
          cards.push("")
        }

        const idx = deck.findIndex(d => d.name == data.player.card.name)

        cards.push(deck[idx].src)
        console.log('cards front: ', cards)
      }

      // if (data.type === 'HEAD') {
      //   //setPause(true)
      //   console.log(data)

      //   if (cards.length === 3)
      //     cards.shift()

      //   if (cards.length === 0)
      //   {
      //     cards.push("")
      //     cards.push("")
      //   }

      //   const idx = deck.findIndex(d => d.name == data.player.card.name)
      //   cards.push(deck[idx].src)

      //   let ind = data.player.id + 1

      //   let draws = 0
      //   if (data.player.card.name === 'A') draws = 1
      //   else if (data.player.card.name === 'B') draws = 2
      //   else if (data.player.card.name === 'C') draws = 3
      //   else if (data.player.card.name === 'D') draws = 4

      // }

      if (data.type === 'TIME')
        setTimer(data.time)

      if (data.type === 'FAIL') {
        setPause(true)
        setFail(true)

        setDecks((prevDecks) => {
          const newDecks = [...prevDecks]
          newDecks[data.player.id] = data.player.deck.length
          return newDecks
        })

        setDiscard(data.discard_value)

        setScore((prevScore) => {
          const newScore = [...prevScore]
          newScore[data.player.id] = data.player.score
          return newScore
        })

        setSmasher(data.player.username)

        setTimerStart(2)
        const intervalId = setInterval ( () => {
          setTimerStart(prev => prev - 1)

          if (timerStart === 0)
            return

        }, 1000)

        clearInterval(intervalId)

        setFail(false)
        setPause(false)
      }

      if (data.type === 'SUCCESS') {
        setPause(true)
        setSuccess(true)
        
        setDecks((prevDecks) => {
          const newDecks = [...prevDecks]
          newDecks[data.player.id] = data.player.deck.length
          return newDecks
        })

        setDiscard(data.discard_value)
        
        setScore((prevScore) => {
          const newScore = [...prevScore]
          newScore[data.player.id] = data.player.score
          return newScore
        })
        
        setSmasher(data.player.username)
        while (cards.length > 0)
          cards.shift()
        
        setTimerStart(2)
        const intervalId = setInterval ( () => {
          setTimerStart(prev => prev - 1)
          
          if (timerStart === 0)
            return
          
        }, 1000)

        clearInterval(intervalId)

        setSuccess(false)
        setPause(false)
      }

      if (data.type === 'WINNER') {
        setStart(false)
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
          cards.push("oui")
          cards.push("oui")
        }

        cards.push(deck[data.player.card.value - 1].src)

      }

      if (data.type === 'WINNER') {
        while (cards.length > 0)
          cards.shift()
        setWinner(data.winner.username)
        setEnd(true)
        setStart(false)
        if (cards.length != 0)
          cards.shift()
      }
    }

    socketRef.current = socket
    setPage(1)
  }

  // useEffect(() => {

  //   if (!starting) return

  //   const intervalId = setInterval ( () => {
     
  //     setTimerStart(prev => prev - 1)

  //     if (timerStart === 0)
  //     {
  //       setStart(true)
  //       setStarting(false)
  //       return
  //     }
  //   }, 1000)

  //   return () => clearInterval(intervalId)
  // }, [starting, timerStart])


  useEffect(() => {
    const detectKeyUp = (e) => {
      if (e.key === " ")
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          console.log("j'a tapé")
          socketRef.current.send(JSON.stringify({ type: 'SMASH', code, username }))
        }
    }

    document.addEventListener('keyup', detectKeyUp, true)

    return () => {
      document.removeEventListener('keyup', detectKeyUp, true)
    }
  }, [username])


  // const timerRef = useRef(30)
  // const intervalRef = useRef(null)

  // useEffect(() => {

  //   if (!start || pause) {
  //     if (intervalRef.current) clearInterval(intervalRef.current)
  //     return
  //   }

  //   intervalRef.current = setInterval(() => {

  //     if (timerRef.current <= 0) {
  //       if (socketRef.current?.readyState === WebSocket.OPEN) {
  //         socketRef.current.send(JSON.stringify({ type: 'END', code }))
  //       }
  //       return
  //     }

  //     timerRef.current -= 1
  //     setTimer(timerRef.current)

  //     setIndex((prevIndex) => {
  //       let nextIdx = prevIndex % 4
      
  //       let attempts = 0
  //       while (decks[nextIdx] === 0 && attempts < 4) {
  //         nextIdx = (nextIdx + 1) % 4
  //         attempts++
  //       }

  //       if (decks[nextIdx] !== 0 && players[nextIdx] === username) {
  //         if (socketRef.current?.readyState === WebSocket.OPEN) {
  //           socketRef.current.send(JSON.stringify({ type: 'DRAW', username, code }))
  //         }
  //       }
  //       return nextIdx + 1
  //     })

  //     setTimer(timerRef.current)

  //   }, 1000)

  //   return () => {
  //     if (intervalRef.current)
  //       clearInterval(intervalRef.current)
  //   }
  // }, [start, pause, code, username])


  const Replay = () => {

    setEnd(false)
    setStart(false)
    setPlayers([])
    setDecks([6, 6, 6, 6])

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ 
        type: 'JOIN', 
        username: username, 
        code: ''
      }))
    } else {
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


	return <>
		{page === 0 && 
    <div className="flex flex-col gap-30 px-8 py-12 max-w-2xl mx-auto h-full justify-center">
      <button 
				className=" bg-secondary px-8 py-6 text-primary font-caprasimo text-3xl uppercase tracking-[0.2em] 
                    border-2 border-primary shadow-[4px_4px_0_0_rgba(28,25,23,1)] hover:bg-amber-400 hover:-translate-y-1 
                    hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)] active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(28,25,23,1)]
                    transition-all"
				onClick={handleJoin}>
				JOIN PUBLIC GAME
			</button>

      <form 
        className=" bg-background px-8 py-6 border-2 border-primaryshadow-[4px_4px_0_0_rgba(28,25,23,1)]hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)]
                    transition-all flex flex-col items-center gap-4"
        onSubmit={handleJoin}>
          <span className=" font-caprasimo text-2xl uppercase tracking-[0.2em] 
                            text-primary">
            JOIN PRIVATE GAME
          </span>
        <div className="flex items-end gap-2 mb-1">
          <span className=" text-[10px] uppercase tracking-[0.3em] 
                            font-bold text-primary-light pb-1">
            CODE :
            </span>
        <input
          id="code"
          name="code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXXXXXXX"
          className=" text-center bg-secondary-light/60 
                      border-2 border-primary px-3 py-1.5 text-xl font-mono tracking-[0.3em] text-primaryplaceholder:text-stone-400 focus:bg-secondary-light 
                      focus:outline-none w-48"
          />
        </div>
        <button 
            type="submit"
            className=" bg-primary px-5 py-1.5 
                        text-background text-xs font-bold uppercase tracking-[0.3em]
                        border-2 border-primary
                        hover:bg-stone-800 hover:-translate-y-0.5 transition-all">
            Rejoindre
        </button>
      </form>

			<button 
				className=" bg-primary px-8 py-6 text-background font-caprasimo text-3xl uppercase tracking-[0.2em] 
                    border-2 border-primary shadow-[4px_4px_0_0_rgba(28,25,23,1)]hover:bg-stone-800 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)]
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

        {player === 0 && <p className=" bg-secondary px-2 py-10 text-primary font-caprasimo text-2xl uppercase tracking-[0.2em] 
                    border-2 border-primary">Joueur</p>}
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

          {player === 3 && <p className=" bg-secondary px-2 py-10 text-primary font-caprasimo text-2xl uppercase tracking-[0.2em] 
                    border-2 border-primary">Joueur</p>}
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

        <p>{discard}</p>

        {end && <div className="flex flex-col items-center justify-center absolute inset-0 z-50">
        {<p className="mb-10 text-4xl text-center font-bold">{winner.toUpperCase()} A GAGNÉ !!!</p>}
        <button 
                className="bg-secondary px-8 py-6 text-primary font-caprasimo text-3xl uppercase tracking-[0.2em] 
                    border-2 border-primary shadow-[4px_4px_0_0_rgba(28,25,23,1)] hover:bg-amber-400 hover:-translate-y-1 
                    hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)] active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(28,25,23,1)]
                    transition-all"
                onClick={Replay}>Rejouer</button>
        </div>}

        {/*starting && <p className="absolute px-120 py-30 text-3xl">LA PARTIE COMMENCE DANS {timerStart} SECONDES</p>*/}

        {pause && fail && <p className="absolute px-120 py-30 text-3xl">{smasher.toUpperCase()} A SMASH !!! EPIC FAIL BRUH ! </p>}
        {pause && success && <p className="absolute px-120 py-30 text-3xl">{smasher.toUpperCase()} A SMASH !!! EPIC WIN WOW ! </p>}

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

          {player === 1 && <p className=" bg-secondary px-2 py-10 text-primary font-caprasimo text-2xl uppercase tracking-[0.2em] 
                    border-2 border-primary">Joueur</p>}
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

        {player === 2 && <p className=" bg-secondary px-2 py-10 text-primary font-caprasimo text-2xl uppercase tracking-[0.2em] 
                    border-2 border-primary">Joueur</p>}
      </div>

    </div>

    }
	</>
}
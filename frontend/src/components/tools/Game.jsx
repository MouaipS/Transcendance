import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


const queryClient = new QueryClient()

export function Game () {
	
	const [page, setPage] = useState(0)
	const [code, setCode] = useState('')
  const [username, setUsername] = useState('Michel')
  const [number, setNumber] = useState(0)

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


	const handleSubmit = (e) => {
		e.preventDefault()

    const body = { username, code }

		fetch('https://localhost:8443/api/game/join',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		}	
		)
		.then( (Response) => {

			if (Response.status === 401) {
				console.log("non", Response.status)
				throw "Erreur retourne en enfer"
			}

			console.log("oui")
			const data = Response.json()
			return data
		})
		.then( (data) => {
			console.log(data.message)
			console.log(data.user)
		}
		)
		.catch((err) => console.error("error:", err))
  }

  const handleCreate = (e) => {

    fetch('https://localhost:8443/api/game/create',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(username)
    }
    )
    setPage(1)
  }

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
				onClick={() => setPage(1)}>
				JOIN PUBLIC GAME
			</button>

      <form 
        className="items-center py-5 rounded-md text-3xl justify-center 
        text-center border bg-yellow-300 font-semibold"
        onSubmit={handleSubmit}>
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

	</>
}
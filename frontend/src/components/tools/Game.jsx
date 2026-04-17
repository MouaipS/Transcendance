import { useState } from "react";
import restaurantImg from "../images/restaurant.webp"
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


const queryClient = new QueryClient()

export function Game () {
	
	const [page, setPage] = useState(0)
	const [code, setCode] = useState()
  const [username, setUsername] = useState('Michel')
  const [number, setNumber] = useState(0)

	const handleSubmit = (e) => {
		e.preventDefault()
		
		fetch('https://localhost:8443/api/code',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(code)
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

	const FetchRooms = () => {
	
		const { data, error, isLoading } = useQuery({
			queryKey: ['rooms'],
			queryFn: () => 
				fetch('https://localhost:8443/api/rooms')
				.then(res => res.json())
		})
		if (isLoading) return <div>Chargement...</div>
		if (error) return <div>Erreur : {error.message}</div>

		if (!data) return <div>Aucune donnée trouvée.</div>

		console.log('data = ', data)
		
		// return <div>
    //   {data.rooms.map(() => (
    //     <div className="flex flex-col px-20 max-w-150">
    //       <button 
    //         className="flex items-center justify-center rounded-md min-h-20
    //         bg-blue-400 font-semibold text-2xl mb-8
    //         hover:bg-blue-300 focus-visible:outline-2 
    //         focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
    //         border border-black shadow-md hover:shadow-none 
    //         hover:inset-shadow-xs hover:inset-shadow-black/50">
    //         <p>Partie de {username}</p>
    //         <p className="px-6">{number}/4</p>
    //       </button>
    //     </div>
    //   ))}
		// </div>
	}

	return <>
		{page === 0 && 
		<div className="flex flex-col px-120 py-12">
			<button 
				className="flex justify-center rounded-md mt-50 min-h-20
				bg-green-400 font-semibold text-4xl items-center
				hover:bg-green-300 focus-visible:outline-2 
				focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
				border border-black shadow-md hover:shadow-none 
				hover:inset-shadow-xs hover:inset-shadow-black/50"
				onClick={() => setPage(1)}>
				JOIN GAME
			</button>

			<button 
				className="flex justify-center rounded-md mt-10 min-h-20
				bg-yellow-400 font-semibold text-4xl items-center
				hover:bg-yellow-300 focus-visible:outline-2 
				focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
				border border-black shadow-md hover:shadow-none 
				hover:inset-shadow-xs hover:inset-shadow-black/50"
				onClick={() => setPage(2)}>
				CREATE GAME
			</button>
		</div>}

		{page === 1 && 
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col py-12">
        <form 
          className="items-center py-5 flex-col rounded-md text-3xl justify-center 
          text-center px-30 border bg-yellow-300"
          onSubmit={handleSubmit}>
          JOIN WITH CODE
          <input
            id="code"
            name="code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="XXXXXXXXX"
            className="mt-4 block w-full text-center rounded-md bg-white 
             outline-1 -outline-offset-1 outline-black py-3 text-2xl
            placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2"
          />
        </form>
      </div>

      <div className="flex flex-col">

        <p className="px-40 text-3xl mb-10">AVAILABLE ROOMS</p>

        <div className="flex flex-col px-20 max-w-150">
          <button 
            className="flex items-center justify-center rounded-md min-h-20
            bg-blue-400 font-semibold text-2xl mb-8
            hover:bg-blue-300 focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
            border border-black shadow-md hover:shadow-none 
            hover:inset-shadow-xs hover:inset-shadow-black/50">
            <p>Partie de {username}</p>
            <p className="px-6">{number}/4</p>
          </button>
        </div>

        <div className="flex flex-col px-20 max-w-150">
          <button 
            className="flex items-center justify-center rounded-md min-h-20
            bg-blue-400 font-semibold text-2xl mb-8
            hover:bg-blue-300 focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
            border border-black shadow-md hover:shadow-none 
            hover:inset-shadow-xs hover:inset-shadow-black/50">
            <p>Partie de {username}</p>
            <p className="px-6">{number}/4</p>
          </button>
        </div>

        <QueryClientProvider client={queryClient}>
          <FetchRooms/>
        </QueryClientProvider>

      </div>
		</div>
		}

    {page === 2 && 
    <div>
        Bonjour
    </div> 
    }
	</>
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../tools/Tabs";
import { useSelector } from "react-redux";


export function Home () {

	const token = useSelector((state) => state.token.value)
	console.log('token = ', token)

	const navigate = useNavigate()
	
	const [username, setUsername] = useState('login ?')
	
	return <>
	<h2 className="font-serif italic mt-10 mb-10 text-center text-2xl/9 font-bold tracking-tight text-black">VegeBattle FruitFight bagarre</h2>
	
	{/* le username doit s'actualiser quand on sera log et afficher le nom d'utilisateur*/}
	<div>
		<h2 className="font-serif text-xl">{username}</h2>
	</div>

	<br />
	Token: {token}

	<button 
		className="flex justify-center rounded-md
		 bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold
		 hover:bg-yellow-300 focus-visible:outline-2 
		 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
		 border border-black shadow-md hover:shadow-none 
		 hover:inset-shadow-xs hover:inset-shadow-black/50 mt-4"
		onClick={() => navigate('/rules')}
		>
		Rulebook
	</button>
	<ul/>
	<button 
		className="flex justify-center rounded-md
		 bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold
		 hover:bg-yellow-300 focus-visible:outline-2 
		 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
		 border border-black shadow-md hover:shadow-none 
		 hover:inset-shadow-xs hover:inset-shadow-black/50"
		onClick={() => navigate('/')}
		>
		Page de Login
	</button>
	<ul/>
	<button 
		className="flex justify-center rounded-md
		 bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold
		 hover:bg-yellow-300 focus-visible:outline-2 
		 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
		 border border-black shadow-md hover:shadow-none 
		 hover:inset-shadow-xs hover:inset-shadow-black/50"
		onClick={() => navigate('/register')}
		>
		Page de Register
	</button>
	<ul/>

	<div>
		<button
			onClick={() => navigate('/statistics')}
			className="inline-flex items-center rounded-md 
			border border-gray-300 shadow-sm px-2 py-2 bg-white 
			text-sm font-medium text-gray-700 hover:bg-gray-50 
			focus:outline-none mt-5"
		>
			<img
					alt="avatar par défaut"
					src="src/components/images/default_avatar.webp"
					className="mx-10 h-10 w-10"
			/>
			{username}
		</button>
	</div>
	<Tabs/>
	</>
}

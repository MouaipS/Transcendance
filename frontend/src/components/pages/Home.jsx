import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../tools/Tabs";


export function Home () {

	const navigate = useNavigate()

	const navigateLogin = () => {
		navigate("/")
	}

	const navigateRegister = () => {
		navigate("/register")
	}

	const navigateRules = () => {
		navigate("/rules")
	}
	
	const [username, setUsername] = useState('login ?')
	
	return <>
	<h2 className="font-serif italic mt-10 mb-10 text-center text-2xl/9 font-bold tracking-tight text-black">VegeBattle FruitFight bagarre</h2>
	
	// le username doit s'actualiser quand on sera log et afficher le nom d'utilisateur
	<div>
		<h2 className="font-serif text-xl">{username}</h2>
	</div>

	<button 
		className="flex justify-center rounded-md
		 bg-blue-400 px-3 py-1.5 text-sm/6 font-semibold
		 hover:bg-blue-300 focus-visible:outline-2 
		 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
		 border border-black shadow-md hover:shadow-none 
		 hover:inset-shadow-xs hover:inset-shadow-black/50 mt-4"
		onClick={navigateRules}
		>
		Rulebook
	</button>
	<ul/>
	<button 
		className="flex justify-center rounded-md
		 bg-blue-400 px-3 py-1.5 text-sm/6 font-semibold
		 hover:bg-blue-300 focus-visible:outline-2 
		 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
		 border border-black shadow-md hover:shadow-none 
		 hover:inset-shadow-xs hover:inset-shadow-black/50"
		onClick={navigateLogin}
		>
		Page de Login
	</button>
	<ul/>
	<button 
		className="flex justify-center rounded-md
		 bg-blue-400 px-3 py-1.5 text-sm/6 font-semibold
		 hover:bg-blue-300 focus-visible:outline-2 
		 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
		 border border-black shadow-md hover:shadow-none 
		 hover:inset-shadow-xs hover:inset-shadow-black/50"
		onClick={navigateRegister}
		>
		Page de Register
	</button>
	<ul/>
	<Tabs/>
	</>
}

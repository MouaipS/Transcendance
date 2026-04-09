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

	return <>
	<h2 className="font-serif italic mt-10 mb-10 text-center text-2xl/9 font-bold tracking-tight text-black">VegeBattle (pour Vegetable t'as capté (Nom sujet à changements parce qu'on utilise aussi de la viande (donc c'est plus juste Végé (Parce qu'il y a de la viande (et la viande c'est pas végé (c'est Lucien qui l'a dit (mais des fois il se trompe (c'est rare (mais ça arrive)))))))))</h2>
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
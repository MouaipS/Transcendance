import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function NavigateButtons () {

	const navigate = useNavigate()

	return <>
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
	</>
}
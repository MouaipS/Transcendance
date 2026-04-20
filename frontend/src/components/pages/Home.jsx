import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../tools/Tabs";

export function Home () {

	const navigate = useNavigate()
	const [username, setUsername] = useState('login ?')

    const logout = async () => {
        fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        })
        .then((Response) => {
            if (Response.status === 200)
            {
                console.log("logged out")
                navigate("/login")
            }
        })
    };

    useEffect(() => {

        const fetchProfile = async () => {

            console.log("Profile - fetch")
            fetch('/api/home',
            {
                method: "GET",
                credentials: "include"
            })
            .then ((Response) => {
                
                if (Response.status === 401) {
				    console.log("non ", Response.status);
                    navigate("/login")
                }
                console.log("Profile - fetch ok");
                const data = Response.json();
                return data;           
            })
            .then ((data) => {
				console.log(data.stats)
                setUser(data.stats)
            })
            .catch ((err) => { 
                console.error("error:", err)
                navigate("/login")
            })
        }
        fetchProfile();
    }, [navigate]);

	return <>
	<h2 className="font-serif italic mt-10 mb-10 text-center text-2xl/9 font-bold tracking-tight text-black">VegeBattle FruitFight bagarre</h2>
	
	<div>
		<h2 className="font-serif text-xl">name: {User.username}</h2>
		<button className="bg-yellow-400 border border-black
			shadow-md hover:shadow-none hover:inset-shadow-xs
			hover:inset-shadow-black/50" onClick={logout}>Log out</button>
	</div>
	<br />
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
		onClick={() => navigate('/login')}
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

	<div dir="ltr">
		<button
			onClick={() => navigate('/statistics')}
			className="flex items-center rounded-md 
			border border-black shadow-md bg-white 
			text-sm font-medium text-gray-700 hover:bg-gray-50 
			focus:outline-none mt-5 pe-8"
		>
			<img
					alt="avatar par défaut"
					src="src/components/images/default_avatar.webp"
					className="mx-15 h-15 w-15 "
			/>
		</button>
	</div>
	<Tabs/>
	</>
}

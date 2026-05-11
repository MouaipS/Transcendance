import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../tools/Tabs";
import CardStack from "../tools/CardStack";
import michelImg from '../images/michel.jpg';
import { NavigateButtons } from "../tools/NavigateButtons";
import { Game } from "../tools/Game";
import { ChatCard } from "../tools/ChatCard"



export function Home () {

	const navigate = useNavigate()
	const [username, setUsername] = useState('login ?')
  const [diff, setDiff] = useState(0)

  const logout = async () => {
    fetch("/api/refresh/logout", {
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

			try {
				let response = await fetch("/api/home", {
					method: "GET",
					credentials: "include"
				})

				if (response.status === 401)
				{
					try {
						let refresh = await fetch('/api/refresh', {
							method: "POST",
							credentials: "include"
						})
						
						if (refresh.ok) 
						{
							try {
								response = await fetch("/api/home", {
									method: "GET",
									credentials: "include"
								})
							} catch (err) { console.error("fetch /api/home(2): ", err); }

						} else { console.error("reresh not ok", err) }
			
					} catch (err) { console.error("fetch /api/refresh: ", err)}
				}
				if (response.ok)
				{
					const data = await response.json()
					setUsername(data.username)

				} else { navigate("/login") }

			} catch (err) { 
				console.error("fetch /api/home(1): ", err)
				navigate("/login")
			}
		}
    	fetchProfile();
  	}, []);

	return <>
	<div className="relative w-full h-screen overflow-hidden bg-amber-50">

    <h1 className="font-caprasimo text-center text-3xl  tracking-tight text-stone-900 pt-6">
      VEGEBATTLE
    </h1>
    <div className="flex gap-8 px-8 pt-6 h-[calc(100vh-100p)]">
      <div className="flex flex-col w-90 shrink-0 min-h-0">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-4 border-2 border-stone-900 bg-amber-50/80 hover:bg-amber-100 hover:-translate-y-0.5 transition-all">
            <img
              src="src/components/images/default_avatar.webp"
              className="h-14 w-14 object-cover border-r-2 border-stone-900"
            />
          <div className="flex flex-col items-start pr-4 py-1">
					  <span className=" text-[10px] uppercase tracking-[0.3em] 
						                  font-bold text-stone-700">
						Chef en service
					  </span>
					  <span className=" font-caprasimo text-2xl text-stone-900 
                  						leading-none">
						{username}
					</span>
          </div>
        </button>
        <CardStack/>
        <button
          className=" self-start bg-stone-900 px-4 py-2 text-xs font-bold 
					            uppercase tracking-[0.3em] text-amber-50 
					            border-2 border-stone-900"
          onClick={logout}>
            Log out
        </button>
      </div>
      <div className="flex-1 border-2 border-stone-900 bg-amber-50/60 overflow-hidden">
        <Game/>
      </div>
    </div>
  </div>
</>
}
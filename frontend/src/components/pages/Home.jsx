import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../tools/Tabs";
import CardStack from "../tools/CardStack";
import michelImg from '../images/michel.jpg';
import { NavigateButtons } from "../tools/NavigateButtons";
import { Game } from "../tools/Game";


export function Home () {

	const navigate = useNavigate()
	const [username, setUsername] = useState('login ?')
  const [diff, setDiff] = useState(0)

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
        if (Response.status === 401) 
        {
          console.log("non ", Response.status);
          navigate("/login")
        }
        console.log("Profile - fetch ok");
        const data = Response.json();
        return data;           
      })
      .then ((data) => {
        setUsername(data.username)
      })
      .catch ((err) => { 
          console.error("error:", err)
          navigate("/login")
      })
    }

    fetchProfile();
  }, [navigate]);

	return <>
	<div className="relative w-full h-screen overflow-hidden">

    <h1 className="font-serif italic text-center text-3xl font-bold tracking-tight text-black pt-6">
      VEGEBATTLE
    </h1>
    <div className="flex gap-8 px-8 pt-6 h-[calc(100vh-100p)]">
      <div className="flex flex-col w-90 shrink-0 min-h-0">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-6 rounded-md border border-black shadow-md bg-white hover:bg-gray-50">
            <img
              src="src/components/images/default_avatar.webp"
              className="h-14 w-14 object-cover rounded-s-lg"/>
            <span className="pr-4 text-2xl">{username}</span>
        </button>
        <CardStack/>
        <button
          className=" mt-6 self-start rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold
                      border border-black shadow-md hover:bg-yellow-300"
          onClick={logout}>
            Log out
        </button>
      </div>
      <div className="flex-1 rounded-md border-4 border-black overflow-hidden">
        <Game/>
      </div>
    </div>
  </div>
</>
}
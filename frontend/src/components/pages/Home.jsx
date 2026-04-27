import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../tools/Tabs";
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
		<div
			className="absolute inset-0 bg-cover bg-center"
			//style={{ backgroundImage: `url(${michelImg})` }}
		>
			<div className="gap-50 flex">
				<div className="absolute flex flex-col left-4">
					<h2 
            className="font-serif italic mt-10 mb-2 
            text-center text-2xl/9 font-bold tracking-tight 
            text-black">VegeBattle FruitFight bagarre</h2>

					<div dir="ltr">
						<button
							onClick={() => navigate('/profile')}
							className="flex items-center gap-6 rounded-md 
							border border-black shadow-md bg-white 
							text-sm font-medium text-gray-700 hover:bg-gray-50 
							focus:outline-none mt-5 min-w-40"
						>
							<img
								alt="avatar par défaut"
								src="src/components/images/default_avatar.webp"
								className="h-14 w-14 object-cover rounded-s-lg"
							/>
							<span className="pr-4 text-2xl">{username}</span>
						</button>
					</div>

					<Tabs/>
				
					<NavigateButtons/>
          
					<div>
						<h2 className="font-serif text-xl">name: </h2>
						<button className="bg-yellow-400 border border-black
							shadow-md hover:shadow-none hover:inset-shadow-xs
							hover:inset-shadow-black/50" onClick={logout}>Log out</button>
					</div>

          <div className="absolute min-w-340 min-h-200 rounded border-4 border-black mt-4 
                flex flex-col left-120 top-10 max-h-200">
            <Game/>
          </div>

        </div>
			</div>
		</div>
	</div>
	</>
}

import { useState, useEffect } from "react";
import bataille from "../images/bataille.jpg";
import macron from "../images/Macron.jpg";
import theo from "../images/thbosvie.jpg"
import { useNavigate } from "react-router-dom";
//import { motion } from "framer-motion";


const todos = [
  'Nommer un Premier Ministre',
  'Accepter la démission du Premier Ministre',
  'Nommer le même Premier Ministre',
  'Dissoudre l\'Assemblée Nationale'
]

export function Login() {

	const [alert, setAlert] = useState('')

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	
	const [showMacron, setShowMacron] = useState(false)
	const [showTheo, setShowTheo] = useState(false)

	const navigate = useNavigate()

	const handleSubmitLogin = (e) => {
		e.preventDefault()

		const login = { username, password }
		
		if (username === '' || password === '') {
			setUsername('')
			setPassword('')
			setAlert("Veuillez remplir tous les champs")
			return
		}
		
		fetch('http://localhost:3001/login',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({username})
		}	
		).then( (res) => {
			console.log(res)
		})

		setUsername('')
		setPassword('')
		setAlert('')
	}


	const handleMacron = (e) => {
		e.preventDefault()

		setShowMacron(!showMacron)
	}

	const Macron = () => {

		if (!showMacron)
			return null

		return <div>
			<img src={macron} width="200" alt="Qu'il est beau notre président"/>
		</div>
	}

	const handleTheo = (e) => {
		e.preventDefault()

		setShowTheo(!showTheo)
	}

	const Theo = () => {

		if (!showTheo)
			return null

		return <div>
			<img src={theo} width="200" alt="Qu'il est beau notre Théo"/>
		</div>
	}

	const navigateToRegister = () => {
		navigate('/register')
	}

	return <>
	<p style={{color: 'red'}}>{alert}</p>

	<div className="absolute inset-y-0 left-15 flex flex-col min-h-full justify-center px-6 py-12 lg:px-8 border-l-1 border-r-1 bg-amber-100">
		<div className="sm:mx-auto sm:w-full sm:max-w-sm">
			<img
				alt="logo"
				src="src/components/images/legumes.png"
				className="mx-auto h-35 w-auto"
			/>
			<h2 className="font-serif italic mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">. . . Sign in to your account . . .</h2>
		</div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="font-serif italic block text-lg/6 font-medium text-black">
                Email address . . . . . . . . . . . . . . . . . . . . . . . . . .
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="font-serif italic block text-lg/6 font-medium text-black">
                  Password . . . . . . . . . . . .
                </label>
                <div className="text-sm">
                  <a href="#" className="font-serif italic font-semibold text-base/6 hover:text-black/50">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold hover:bg-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 border-1 border-black shadow-md hover:shadow-none hover:inset-shadow-xs hover:inset-shadow-black/50"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-serif italic text-base font-semibold hover:text-gray-500/50">
              Register
            </a>
          </p>
		</div>
      </div>

    </>
}

/*
*/

function Title ({color, children, hidden}) {
	if (hidden) {
    	return null
  	}

  	const handleClickTitle = () => {
    	alert("For sure !")
  	}

  	return <h1 onClick={handleClickTitle} style={{color: color}}>{children}</h1>
}

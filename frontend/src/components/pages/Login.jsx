import { useState, useEffect } from "react";
import bataille from "../images/bataille.jpg";
import macron from "../images/Macron.jpg";
import theo from "../images/thbosvie.jpg"
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "../tools/fetchs";
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

	const [isLogged, setIsLogged] = useState(false)
	
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
		
		fetch('http://localhost:3000/login',
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

		if (isLogged)
			navigate('/home')
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


	return <>
	<img src={bataille} width="400" heigth="100" alt="Deuxième guerre de Corse"/>
    <h1 id="title" className="title">Login</h1>
	<p style={{color: 'red'}}>{alert}</p>
	<form onSubmit={handleSubmitLogin}>
		<input
			value={username}
			placeholder="Username"
			onChange={(e) => setUsername(e.target.value)}
		/>
		<ul/>
		<input
			value={password}
			placeholder="Password"
			onChange={(e) => setPassword(e.target.value)}
		/>
		<ul/>
		<button>Login</button>
	</form>
	<ul/>
	<a href="/register">Create Account</a>
	<ul/>
	<button onClick={handleMacron}>Macron explosion</button>
	<Macron />
	<ul/>
	<button onClick={handleTheo}>Le GOAT</button>
	<Theo />
	<ul/>
    </>
}

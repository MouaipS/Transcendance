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
		
		fetch('https://localhost:8443/api/login',
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
	<img src={bataille} width="400" heigth="100" alt="Deuxième guerre de Corse"/>
    <Title color="green">Annonce aux français</Title>
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
	<button onClick={navigateToRegister}>Create Account</button>
    <p>
      Ouais salut les djeuns c'est Macron et chui ô Japon. Voilà ma liste de choses à faire en rentrant :
    </p>
    <ul>
      {todos.map(todo => (<li key={todo}>{todo}</li>))}
    </ul>
	<button onClick={handleMacron}>Macron explosion</button>
	<Macron />
	<ul/>
	<button onClick={handleTheo}>Le GOAT</button>
	<Theo />
	<ul/>
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

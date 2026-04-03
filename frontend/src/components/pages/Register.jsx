import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


const queryClient = new QueryClient()

export function Register() {

	const [alert, setAlert] = useState('')

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')
	const [nickname, setNickname] = useState('')

	const [showGet, setShowGet] = useState(false)

	const navigate = useNavigate()

	const handleSubmitRegister = (e) => {
		e.preventDefault()

		const registration = { username, password, email, nickname }
		
		if (username === '' || password === '' || email === '' || nickname === '') {
			setUsername('')
			setPassword('')
			setEmail('')
			setNickname('')
			setAlert("Veuillez remplir tous les champs")
			return
		}

		fetch('https://localhost:8443/api/register',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({username, password})
		}	
		).then( () => {
			console.log("Success")
		})

		setUsername('')
		setPassword('')
		setEmail('')
		setNickname('')
		setAlert('')
	}

	const FetchName = () => {
	
		if (!showGet)
			return null
		const { data, error, isLoading } = useQuery({
			queryKey: ['username'],
			queryFn: () => 
				fetch('http://localhost:3001/users')
				.then(res => res.json())
		})
		if (isLoading) return <div>Chargement...</div>
		if (error) return <div>Erreur : {erreur.message}</div>

		const datas = []

		for (let i = 0; i < data.length; i++) {
			datas[i] = data[i].username
		}

		return <div>{datas.map(todo => (<li key={todo}>{todo}</li>))}</div>
	}

	const handleClick = (e) => {
		e.preventDefault()

		setShowGet(!showGet)
	}

	const navigateLogin = () => {
		navigate('/')
	}


	return <>
    <Title color="green">Annonce aux français</Title>
	<p style={{color: 'red'}}>{alert}</p>
    <form onSubmit={handleSubmitRegister}>
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
		<input
			value={email}
			placeholder="E-mail address"
			onChange={(e) => setEmail(e.target.value)}
		/>
		<ul/>
		<input
			value={nickname}
			placeholder="Nickname"
			onChange={(e) => setNickname(e.target.value)}
		/>
		<ul/>
		<button>Register</button>
	</form>
	<ul/>
	<form>
		<button onClick={handleClick}>Récupérer</button>
	</form>
	<QueryClientProvider client={queryClient}>
		<FetchName />
	</QueryClientProvider>
	<ul/>
	<button onClick={navigateLogin}>Retour à la page de connexion</button>
    </>
}


function Title ({color, children}) {

  	const handleClickTitle = () => {
    	alert("For sure !")
  	}

  	return <h1 onClick={handleClickTitle} id="title" className="title" style={{color: color}}>{children}</h1>
}

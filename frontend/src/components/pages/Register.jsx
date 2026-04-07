import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


const queryClient = new QueryClient()

export function Register() {

	const [alert, setAlert] = useState('')

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
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
			setConfirmPassword('')
			setEmail('')
			setNickname('')
			setAlert("Veuillez remplir tous les champs")
			return
		}
		else if (password !== confirmPassword) {
			setUsername('')
			setPassword('')
			setConfirmPassword('')
			setEmail('')
			setNickname('')
			setAlert("Les mots de passe ne sont pas identiques")
			return
		}

		fetch('http://localhost:3001/register',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({username})
		}	
		).then( () => {
			console.log("Success")
		})

		setUsername('')
		setPassword('')
		setConfirmPassword('')
		setEmail('')
		setNickname('')
		setAlert('')

		navigate('/home')
	}

	const FetchName = () => {
	
		if (!showGet)
			return null
		const { data, error, isLoading } = useQuery({
			queryKey: ['username'],
			queryFn: () => 
				fetch('http://localhost:3000/users')
				.then(res => res.json())
		})
		if (isLoading) return <div>Chargement...</div>
		if (error) return <div>Erreur : {error.message}</div>

		const datas = []

		for (let i = 0; i < data.length; i++) {
			datas[i] = data[i].username
		}

		return <ul>{datas.map(todo => (<li key={todo}>{todo}</li>))}</ul>
	}

	const handleClick = (e) => {
		e.preventDefault()

		setShowGet(!showGet)
	}

	const navigateLogin = () => {
		navigate('/')
	}


	return <>
    <h1 className="font-serif text-2xl" >Register</h1>
	<p style={{color: 'red'}}>{alert}</p>
    <form onSubmit={handleSubmitRegister}>
		<input
			value={username}
			placeholder="Username"
			onChange={(e) => setUsername(e.target.value)}
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
		<input
			value={password}
			placeholder="Password"
			onChange={(e) => setPassword(e.target.value)}
		/>
		<ul/>
		<input
			value={confirmPassword}
			placeholder="Confirm Password"
			onChange={(e) => setConfirmPassword(e.target.value)}
		/>
		<ul/>
		<button>Register</button>
	</form>
	<ul/>
	<form>
		<button onClick={handleClick}>Récupérer les infos de la Database</button>
	</form>
	<QueryClientProvider client={queryClient}>
		<FetchName />
	</QueryClientProvider>
	<ul/>
	<button onClick={navigateLogin}>Retour à la page de connexion</button>
	</>
}

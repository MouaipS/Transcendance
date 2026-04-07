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
		
		// if (username === '' || password === '' || email === '' || nickname === '') {
		// 	setUsername('')
		// 	setPassword('')
		// 	setConfirmPassword('')
		// 	setEmail('')
		// 	setNickname('')
		// 	setAlert("Veuillez remplir tous les champs")
		// 	return
		// }
		if (password !== confirmPassword) {
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
	<div className="absolute inset-y-0 left-15 flex flex-col min-h-full 
		justify-center px-6 py-12 lg:px-8 border-l border-r bg-amber-100">
		<div className="sm:mx-auto sm:w-full sm:max-w-sm">
			<h2 className="font-serif italic mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">. . . Create your account . . .</h2>
		</div>
		<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form onSubmit={handleSubmitRegister} className="space-y-6">
				<div>
					<label htmlFor="username" className="font-serif italic 
						block text-lg/6 font-medium text-black">
						Username . . . . . . . . . . . . . . . . . . . . . . . . . .
					</label>
					<div className="mt-2">
						<input
							id="username"
							name="username"
							required
							value={username}
							placeholder="Cedric Grolet"
							onChange={(e) => setUsername(e.target.value)}
							className="block w-full rounded-md bg-black/5 px-3 
									py-1.5 text-base outline-1 -outline-offset-1
									outline-black/10 placeholder:text-gray-500 
									focus:outline-2 focus:-outline-offset-2 
									focus:outline-yellow-400 sm:text-sm/6"
						/>
					</div>
				</div>
				<div>
					<label htmlFor="email" className="font-serif italic 
						block text-lg/6 font-medium text-black">
						Email address . . . . . . . . . . . . . . . . . . . . . . . . . .
					</label>
					<div className="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							placeholder="cedriclebôgoss@cedricgrolet.com"
							onChange={(e) => setEmail(e.target.value)}
							className="block w-full rounded-md bg-black/5 px-3 
								py-1.5 text-base outline-1 -outline-offset-1
								outline-black/10 placeholder:text-gray-500 
								focus:outline-2 focus:-outline-offset-2 
								focus:outline-yellow-400 sm:text-sm/6"
						/>
					</div>
				</div>
				<div>
					<label htmlFor="nickname" className="font-serif italic 
						block text-lg/6 font-medium text-black">
						Nickname . . . . . . . . . . . . . . . . . . . . . . . . . .
					</label>
					<div className="mt-2">
						<input
							id="nickname"
							name="nickname"
							required
							value={nickname}
							placeholder="Cedricdu86"
							onChange={(e) => setNickname(e.target.value)}
							className="block w-full rounded-md bg-black/5 px-3 
								py-1.5 text-base outline-1 -outline-offset-1
								outline-black/10 placeholder:text-gray-500 
								focus:outline-2 focus:-outline-offset-2 
								focus:outline-yellow-400 sm:text-sm/6"
						/>
					</div>
				</div>
				<div>
					<label htmlFor="password" className="font-serif italic 
						block text-lg/6 font-medium text-black">
						Password . . . . . . . . . . . . . . . . . . . . . . . . . .
					</label>
					<div className="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							required
							value={password}
							placeholder="CroissantÀ70€"
							onChange={(e) => setPassword(e.target.value)}
							className="block w-full rounded-md bg-black/5 px-3 
									py-1.5 text-base outline-1 -outline-offset-1
									outline-black/10 placeholder:text-gray-500 
									focus:outline-2 focus:-outline-offset-2 
									focus:outline-yellow-400 sm:text-sm/6"
						/>
					</div>
				</div>
				<div>
					<label htmlFor="password" className="font-serif italic 
						block text-lg/6 font-medium text-black">
						Confirm Password . . . . . . . . . . . . . . . . . . . . . . . . . .
					</label>
					<div className="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							required
							value={confirmPassword}
							placeholder="CroissantÀ70€"
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="block w-full rounded-md bg-black/5 px-3 
									py-1.5 text-base outline-1 -outline-offset-1
									outline-black/10 placeholder:text-gray-500 
									focus:outline-2 focus:-outline-offset-2 
									focus:outline-yellow-400 sm:text-sm/6"
						/>
					</div>
				</div>
				<div className="mt-2">
					<button
						type="submit"
						className="flex w-full justify-center rounded-md
						bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold
						hover:bg-yellow-300 focus-visible:outline-2 
						focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
						border border-black shadow-md hover:shadow-none 
						hover:inset-shadow-xs hover:inset-shadow-black/50">
						Register
					</button>
				</div>
			</form>
			<div className="mt-2">
				<button
					type="submit"
					className="flex w-full justify-center rounded-md
					bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold
					hover:bg-yellow-300 focus-visible:outline-2 
					focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
					border border-black shadow-md hover:shadow-none 
					hover:inset-shadow-xs hover:inset-shadow-black/50"
					onClick={handleClick}>Récupérer les infos de la Database
				</button>
			</div>
			<QueryClientProvider client={queryClient}>
				<FetchName />
			</QueryClientProvider>
			<div className="mt-2">	
				<button
					type="submit"
					className="flex w-full justify-center rounded-md
					bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold
					hover:bg-yellow-300 focus-visible:outline-2 
					focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
					border border-black shadow-md hover:shadow-none 
					hover:inset-shadow-xs hover:inset-shadow-black/50"
					onClick={navigateLogin}>Retour à la page de connexion
				</button>
			</div>
		</div>
	</div>
	</>
}

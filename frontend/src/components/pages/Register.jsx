import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient()

export function Register() {

	// Sert pour afficher une erreur si l'utilisateur
	// n'entre pas les 2 mêmes mots de passe
	const [alert, setAlert] = useState('')

	// Variable utilisées pour l'authentification et leurs
 	// setters, qui permettent de modifier leurs valeurs
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [email, setEmail] = useState('')
	const [nickname, setNickname] = useState('')

	const [showGet, setShowGet] = useState(false)

	// Permet de naviguer vers une autre page 
  	// en appelant la fonction navigate
	const navigate = useNavigate()

	// Fonction appelée en soumettant le form de register,
  	// envoie une requête au back pour créer un nouvel
	// utilisateur dans la DB
	const handleSubmitRegister = async(e) => {
		e.preventDefault()

		const registration = { username, password }

		if (password !== confirmPassword) {
			setUsername('')
			setPassword('')
			setConfirmPassword('')
			setEmail('')
			setNickname('')
			setAlert("Les mots de passe ne sont pas identiques")
			return
		}

		fetch('https://localhost:8443/api/register',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(registration),
			credentials: "include"
		})
		.then( (Response) => {

			if (Response.status === 401) {
				setAlert("User already exist")
				throw "Erreur retourne en enfer"
			}

			console.log("Register successful")
			setUsername('')
			setPassword('')
			setConfirmPassword('')
			setEmail('')
			setNickname('')
			setAlert('')
			navigate("/")		
		})
		.catch((err) => console.error("error:", err))
	}


	return <>
	<img 
		alt="Le grand chef cuisinier Philippe Etchebest"
		src="src/components/images/philippe.jpg"
		className="w-full h-screen absolute inset-0 object-cover object-top"
		onClick={() => navigate('/')}
	/>
	<div className="absolute inset-y-0 left-15 flex flex-col min-h-full 
		justify-center px-6 py-12 lg:px-8 border-l border-r bg-amber-100">
		<div className="sm:mx-auto sm:w-full sm:max-w-sm">
			<img
				alt="logo"
				src="src/components/images/entrecôte.png"
				className="mx-auto h-35 w-auto"
			/>
			<h2 className="font-serif italic mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">. . . Create your account . . .</h2>
		</div>
		<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<p style={{color: 'red'}}>{alert}</p>
			<form onSubmit={handleSubmitRegister} className="space-y-6">
				<div>
					<label htmlFor="username" className="font-serif italic 
						block text-lg/6 font-medium text-black">
						Username . . . . . . . . . . . . . . . . . . . . . . . . . . . .
					</label>
					<div className="mt-2">
						<input
							id="username"
							name="username"
							required
							value={username}
							minlength="3"
							maxlength="12"
							placeholder="Cedric Grolard"
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
						Email address . . . . . . . . . . . . . . . . . . . . . . . .
					</label>
					<div className="mt-2">
						<input
							id="email"
							name="email"
							//type="email"
							required
							value={email}
							placeholder="cedriclebôgoss@grolard.com"
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
					<label htmlFor="password" className="font-serif italic 
						block text-lg/6 font-medium text-black">
						Password . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
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
						Confirm Password . . . . . . . . . . . . . . . . . . . . .
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
					onClick={() => navigate('/login')}>Retour à la page de connexion
				</button>
			</div>
		</div>
	</div>
	</>
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export function ResetPassword() {

	// Sert pour afficher une erreur si l'utilisateur
	// n'entre pas les 2 mêmes mots de passe
	const [alert, setAlert] = useState('')
	
	// Variable utilisées pour l'authentification et leurs
 	// setters, qui permettent de modifier leurs valeurs
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	// Permet de naviguer vers une autre page 
  	// en appelant la fonction navigate
	const navigate = useNavigate()

	// Fonction appelée en soumettant le form de changement de mdp,
  	// envoie une requête au back pour modifier 
	// le mot de passe de l'utilisateur dans la DB
	const handleSubmitReset = (e) => {
		e.preventDefault()

		const reset = { username, password }

		if (password !== confirmPassword) {
			setUsername('')
			setPassword('')
			setConfirmPassword('')
			setAlert("Les mots de passe ne sont pas identiques")
			return
		}
		
		fetch('http://localhost:3001/login',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reset)
		}	
		).then( (res) => {
			console.log(res)
		})

		setUsername('')
		setPassword('')
		setConfirmPassword('')

	}


	return <>
	<div className="absolute inset-y-0 left-15 flex flex-col min-h-full justify-center px-6 py-12 lg:px-8 border-l border-r bg-amber-100">
		<div className="sm:mx-auto sm:w-full sm:max-w-sm">
			<img
				alt="logo"
				src="src/components/images/legumes.png"
				className="mx-auto h-35 w-auto"
			/>
			<h2 className="font-serif italic mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">. . . Reset your password . . .</h2>
		</div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<p style={{color: 'red'}}>{alert}</p>
          	<form action="#" method="POST" className="space-y-6" onSubmit={handleSubmitReset}>
				<div>
					<label htmlFor="username" className="font-serif italic block text-lg/6 font-medium text-black">
						Username or Email . . . . . . . . . . . . . . .
					</label>
					<div className="mt-2">
						<input
							id="username"
							name="username"
							required
							autoComplete="email"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Philippe Etchebest"
							className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
						/>
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between">
						<label htmlFor="password" className="font-serif italic block text-lg/6 font-medium text-black">
						New Password . . . . . . . . . . . . . . . . . . . .
						</label>
					</div>
					<div className="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
									placeholder="CauchemarEnCuisine"
							className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
						/>
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between">
						<label htmlFor="password" className="font-serif italic block text-lg/6 font-medium text-black">
							Confirm Password . . . . . . . . . . . . . . . . .
						</label>
					</div>
					<div className="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							autoComplete="current-password"
									placeholder="CauchemarEnCuisine"
							className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold hover:bg-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 border border-black shadow-md hover:shadow-none hover:inset-shadow-xs hover:inset-shadow-black/50"
					>
						Reset password
					</button>
				</div>
          	</form>

		</div>
    </div>

    </>
}
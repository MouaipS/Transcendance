import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setter } from '../data/tokenSlice.jsx';


export function Login() {
  
  const token = useSelector((state) => state.token.value)
  const dispatch = useDispatch()

  // Variable utilisées pour l'authentification et leurs
  // setters, qui permettent de modifier leurs valeurs
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

  // Permet de naviguer vers une autre page 
  // en appelant la fonction navigate
	const navigate = useNavigate()

  // Fonction appelée en soumettant le form de login,
  // envoie une requête au back pour vérifier si l'utilisateur
  // est enregistré
	const handleSubmitLogin = (e) => {
		e.preventDefault()

		const login = { username, password }
		
		fetch('https://localhost:8443/api/login',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(login)
		}	
		)
		.then( (Response) => {

			if (Response.status === 401) {
				console.log("non", Response.status)
				throw "Erreur retourne en enfer"
			}

			console.log("oui")
			const data = Response.json()
			return data
		})
		.then( (data) =>
			{
				console.log(data.message)
				console.log(data.user)
				setUsername('')
				setPassword('')
				navigate('/home')
			}
		)
		.catch((err) => console.error("error:", err))
  }
    /*
    fetch('https://localhost:8443/api/login',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(login)
		})
		.then(Response => Response.json())
    .then(json => {
      console.log(json)
      if (json?.token) {
        dispatch(setter(json.token))
      }
    })
    .catch((err) => console.error("error:", err))
    */
  
  //navigate('/home')

	return <>
  <img 
    alt="Le grand chef cuisinier Michel Dumas"
    src="src/components/images/michel.jpg"
    className="w-full h-screen absolute inset-0 object-cover"
    onClick={() => navigate('/home')}
  />
  <div className="absolute inset-y-0 left-15 flex flex-col min-h-full justify-center px-6 py-12 lg:px-8 border-l border-r bg-amber-100">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        alt="logo"
        src="src/components/images/legumes.png"
        className="mx-auto h-35 w-auto"
      />
      <h2 className="font-serif italic mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">. . . Sign in to your account . . .</h2>
    </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmitLogin}>
            <div>
              <label htmlFor="username" className="font-serif italic block text-lg/6 font-medium text-black">
                Username . . . . . . . . . . . . . . . . . . . . . . . . . .
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  required
                  autoComplete="username"
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
                  Password . . . . . . . . . . . .
                </label>
                <div className="text-sm">
                  <a href="/password_reset" className="font-serif italic font-semibold text-base/6 hover:text-black/50">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <a href="/register" className="font-serif italic text-base font-semibold hover:text-gray-500/50">
              Register
            </a>
          </p>
    </div>
  </div>
  </>
}

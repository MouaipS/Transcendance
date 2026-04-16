import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { Login } from "./components/pages/Login.jsx"
import { Register } from "./components/pages/Register.jsx"
import { Home } from "./components/pages/Home.jsx"
import { Rules } from "./components/pages/Rules.jsx"
import { Statistics } from "./components/pages/Statistics.jsx"
import { Recipes } from "./components/pages/Recipes.jsx"
import { ResetPassword } from "./components/pages/ResetPassword.jsx";

import { Provider } from 'react-redux'
import store from './components/data/store.jsx'

// Architecture du site avec les différentes pages, 
// leur URL et leur contenu
const router = createBrowserRouter([
	{
		path: '/',
		element: <div>
			<Login/>
		</div>
	},
	{
		path: '/register',
		element: <div>
			<Register/>
		</div>
	},
	{
		path: '/home',
		element: <div>
			<Home/>
		</div>
	},
	{
		path: '/rules',
		element: <div>
			<Rules/>
		</div>
	},
	{
		path: '/statistics',
		element: <div>
			<Statistics/>
			<ul/>
			<nav>
				<Link to="/home">Home</Link>
			</nav>
		</div>
	},
	{
		path: '/recipes',
		element: <div>
			<Recipes/>
			<ul/>
			<nav>
				<Link to="/home">Home</Link>
			</nav>
		</div>
	},
	{
		path: '/password_reset',
		element: <div>
			<ResetPassword/>
			<ul/>
			<nav>
				<Link to="/home">Home</Link>
			</nav>
		</div>
	}
])


function App() {

	return <>
		<Provider store={store}>
			<RouterProvider router={router}/>
		</Provider>
    </>
}



export default App

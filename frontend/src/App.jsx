import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { Login } from "./components/pages/Login.jsx"
import { Register } from "./components/pages/Register.jsx"
import { Home } from "./components/pages/Home.jsx"
import { Rules } from "./components/pages/Rules.jsx"
import { Statistics } from "./components/pages/Statistics.jsx"
import { Recipes } from "./components/pages/Recipes.jsx"
import { ResetPassword } from "./components/pages/ResetPassword.jsx";

// Architecture du site avec les différentes pages, 
// leur URL et leur contenu
const router = createBrowserRouter([
	{
		path: '/',
		element: <div>
			<Home/>
			<ul/>
		</div>
	},
	{
		path: '/register',
		element: <div>
			<Register/>
			<ul/>
		</div>
	},
	{
		path: '/login',
		element: <div>
			<Login/>
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
				<Link to="/">Home</Link>
			</nav>
		</div>
	},
	{
		path: '/recipes',
		element: <div>
			<Recipes/>
			<ul/>
			<nav>
				<Link to="/">Home</Link>
			</nav>
		</div>
	},
	{
		path: '/password_reset',
		element: <div>
			<ResetPassword/>
			<ul/>
		</div>
	}
])


function App() {

	return <>
		<RouterProvider router={router}/>
    </>
}



export default App

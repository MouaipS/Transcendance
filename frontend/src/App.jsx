import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { Login } from "./components/pages/Login.jsx"
import { Register } from "./components/pages/Register.jsx"
import { Home } from "./components/pages/Home.jsx"
import { Rules } from "./components/pages/Rules.jsx"
import { Statistics } from "./components/pages/Statistics.jsx"
import { Parameters } from "./components/pages/Parameters.jsx"
import { Recipes } from "./components/pages/Recipes.jsx"


const router = createBrowserRouter([
	{
		path: '/',
		element: <div>
			<Login/>
			<ul/>
			<nav>
				<Link to="/home">Home</Link>
			</nav>
		</div>
	},
	{
		path: '/register',
		element: <div>
			<Register/>
			<ul/>
			<nav>
				<Link to="/home">Home</Link>
			</nav>
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
		path: '/parameters',
		element: <div>
			<Parameters/>
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
	}
])


function App() {

	return <>
	<RouterProvider router={router}/>
    </>
}



export default App
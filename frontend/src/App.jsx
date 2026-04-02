import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { Login } from "./components/pages/Login.jsx"
import { Register } from "./components/pages/Register.jsx"


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
	}
])


function App() {

	return <>
	<RouterProvider router={router}/>
    </>
}



export default App
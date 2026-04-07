import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function fetchLogin (username) {
	
	const navigate = useNavigate()
	const [isLogged, setIsLogged] = useState(false)
	
	fetch('http://localhost:3001/login',
	{
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({username})
	}	
	).then( (res) => {
		console.log(res)
	})

	if (isLogged)
		navigate('/home')
}
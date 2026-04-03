import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../tools/Tabs";



export function Home () {

	const navigate = useNavigate()

	const navigateLogin = () => {
		navigate("/")
	}

	const navigateRegister = () => {
		navigate("/register")
	}

	const navigateRules = () => {
		navigate("/rules")
	}

	return <>
	<h1>VegeBattle (pour Vegetable t'as compris (Nom sujet à changements parce qu'on utilise aussi de la viande (donc c'est plus juste Végé (Parce qu'il y a de la viande (et la viande c'est pas végé (c'est Lucien qui l'a dit (mais des fois il se trompe)))))))</h1>
	<ul/>
	<button onClick={navigateRules}>Rulebook</button>
	<ul/>
	<button onClick={navigateLogin}>Page de Login</button>
	<ul/>
	<button onClick={navigateRegister}>Page de Register</button>
	<ul/>
	<Tabs/>
	</>
}
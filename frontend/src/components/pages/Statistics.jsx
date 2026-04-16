import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


// Utilisé pour fetch depuis le back,
// oui c'est encore un autre plug-in...
const queryClient = new QueryClient()

// Requête GET pour récupérer les infos depuis la DB afin
// d'afficher les statistiques de l'utilisateur dans l'onglet stats
const FetchName = () => {
	
	const { data, error, isLoading } = useQuery({
		queryKey: ['stats'],
		queryFn: () => 
			fetch('https://localhost:8443/api/home?username=oui')
			.then(res => res.json())
	})
	if (isLoading) return <div>Chargement...</div>
	if (error) return <div>Erreur : {error.message}</div>

	if (!data) return <div>Aucune donnée trouvée.</div>

	return <div>
		<ul>
			<li>Matchs joués : {data.stats.nb_games}</li>
			<li>Victoires : {data.stats.nb_victories}</li>
			<li>Défaites : {data.stats.nb_defeats}</li>
        </ul>
	</div>
}


export function Statistics () {


	return <>
		<QueryClientProvider client={queryClient}>
			<FetchName />
		</QueryClientProvider>
	</>
}
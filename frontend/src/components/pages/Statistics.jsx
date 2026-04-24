import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


// Utilisé pour fetch depuis le back,
// oui c'est encore un autre plug-in...
const queryClient = new QueryClient()

// Requête GET pour récupérer les infos depuis la DB afin
// d'afficher les statistiques de l'utilisateur dans l'onglet stats
const FetchStats = () => {
	
	const { data, error, isLoading } = useQuery({
		queryKey: ['stats'],
		queryFn: () => 
			fetch('api/home', {
				method: 'GET',
				credentials: 'include'
			})
			.then(res => {
				if (res.status === 401) {
					NavigateEvent('/login')
					throw new Error('Not authentificate user')
				}
				return res.json()
			})
	})

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error : {error.message}</div>
	if (!data || !data.stats) return <div>None data found</div>


	const s = data.stats //raccourci
	const calcWinRate = s.nb_games > 0 ? Math.round((s.nb_victories / s.nb_games) * 100) : 0

	return <div>
		<p>Match played : {s.nb_games}</p>
		<p>Victories : {s.nb_victories}</p>
		<p>Defeats : {s.nb_defeats}</p>
		<p>Ratio V/D : {calcWinRate}%</p>
	</div>
}

export function Statistics () {
	return <>
		<QueryClientProvider client={queryClient}>
			<FetchStats />
		</QueryClientProvider>
	</>
}
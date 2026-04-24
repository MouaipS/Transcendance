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

	return <div>
		<p>Match joués : {data.stats.nb_games}</p>
	</div>
}

export function Statistics () {
	return <>
		<QueryClientProvider client={queryClient}>
			<FetchStats />
		</QueryClientProvider>
	</>
}
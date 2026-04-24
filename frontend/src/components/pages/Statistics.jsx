import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


// Utilisé pour fetch depuis le back,
// oui c'est encore un autre plug-in...
const queryClient = new QueryClient()


const StatCard = ({ label, value }) => (
	<div className="
			bg-amber-50				//fond beige
			border-2				//bordure 2px d'epaisseur
			border-amber-900/40		//opacité 40%
			rounded-lg 				//coins arrondis
			p-4						//padding interieur (espacement entre le contenu et sa bordure)

			shadow-md				//ombre moyenne au repos
			hover:shadow-lg			//ombre plus grande au survol
			hover:-translate-y-1	//soulevement de 4px
			transition-all			//anime tout les changements
			duration-150			//duree de l'animation 150ms
			
			flex flex-col			//empilement vertical des blocs StatCard
			justify-center			//centrage des card
			min-h-32">

		<div className="
			text-4xl				//taille
			text-center				//centrage
			font-caprasimo			//police custom
			text-black				//couleur du texte
			">
			{value}
		</div>
		<div className="
			text-sm					//taille
			text-center				//centre
			text-amber-900/80		//couleur brune 80%
			font-medium				//gras
			mt-2					//marge haute
			uppercase				//majuscule
			tracking-wider			//espace des lettres
			">
			{label}
		</div>
	</div>
)



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

	return <div className="grid grid-colis-4 gap-4 p-8"> 
		<StatCard label="Match played"	value={s.nb_games}/>
		<StatCard label="Victories"		value={s.nb_victories}/>
		<StatCard label="Defeats"		value={s.nb_defeats}/>
		<StatCard label="Ratio V/D"		value={calcWinRate}/>
	</div>
}

export function Statistics () {
	return <>
		<QueryClientProvider client={queryClient}>
			<FetchStats />
		</QueryClientProvider>
	</>
}
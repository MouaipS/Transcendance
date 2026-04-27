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
			fetch('https://localhost:8443/api/home')
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

const FetchRecipes = () => {
	
	const { data, error, isLoading } = useQuery({
		queryKey: ['recipes'],
		queryFn: () => 
			fetch('https://localhost:8443/api/home')
			.then(res => res.json())
	})
	if (isLoading) return <div>Chargement...</div>
	if (error) return <div>Erreur : {error.message}</div>

	if (!data) return <div>Vous n'êtes pas actuellement dans une partie.</div>
	
	return <div>
		<ul>
			{/* <li>Matchs joués : {data.recipes}</li>
			<li>Victoires : {data.recipes}</li>
			<li>Défaites : {data.recipes}</li> */}
        </ul>
	</div>
}

// Tableau contenant les différents onglets de Home
const tabsData = [
	{
		tabTitle: <img
					alt="logo"
					src="src/components/images/stats.png"
					className="mx-auto h-auto w-auto"
					/>,
		tabHeading: "oui les stats",
		txt: <QueryClientProvider client={queryClient}>
				<FetchStats />
			</QueryClientProvider>,
		url: "/profile"
	},
	{
		tabTitle: <img
					alt="logo"
					src="src/components/images/recipes.png"
					className="mx-auto h-auto w-auto"
					/>,
		tabHeading: "oui les recettes",
		txt: <QueryClientProvider client={queryClient}>
				<FetchRecipes />
			</QueryClientProvider>,
		url: "/recipes"
	},
	{
		tabTitle: <img
					alt="logo"
					src="src/components/images/rules.png"
					className="mx-auto h-auto w-auto"
					/>,
		tabHeading: "Règles du jeu (en vif)",
		txt: <>
			<p>Le but du jeu est d'obtenir le plus de points possibles. Les joueurs obtiennent des points en remportant des plis. 
				Il existe plusieurs façons de remporter un pli :
				<li>Taper en cas de paire</li>
				<li>Taper en cas de sandwich</li>
				<li>Remplir son récipient</li>
			</p>
		</>,
		url: "/rules"
	}
]

export { tabsData }
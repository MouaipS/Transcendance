import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import DropdownDifficulty from '../tools/DropdownDifficulty';
import DropdownLanguage from '../tools/DropdownLanguage';


// Utilisé pour fetch depuis le back,
// oui c'est encore un autre plug-in...
const queryClient = new QueryClient()

// Requête GET pour récupérer les infos depuis la DB afin
// d'afficher les statistiques de l'utilisateur dans l'onglet stats
const FetchName = () => {
	
	// const { data, error, isLoading } = useQuery({
	// 	queryKey: ['username'],
	// 	queryFn: () => 
	// 		fetch('http://localhost:3001/users')
	// 		.then(res => res.json())
	// })
	// if (isLoading) return <div>Chargement...</div>
	// if (error) return <div>Erreur : {error.message}</div>

	const datas = []

	// for (let i = 0; i < data.length; i++) {
	// 	datas[i] = data[i].username
	// }

	return <div>{datas.map(todo => (<li key={todo}>{todo}</li>))}</div>
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
				<FetchName />
			</QueryClientProvider>,
		url: "/statistics"
	},
	{
		tabTitle: <img
					alt="logo"
					src="src/components/images/recipes.png"
					className="mx-auto h-auto w-auto"
					/>,
		tabHeading: "oui les recettes",
		txt: "Ceci être le placeholder des recettes",
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
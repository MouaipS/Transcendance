import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


const queryClient = new QueryClient()

const FetchName = () => {
	
	const { data, error, isLoading } = useQuery({
		queryKey: ['username'],
		queryFn: () => 
			fetch('http://localhost:3001/users')
			.then(res => res.json())
	})
	if (isLoading) return <div>Chargement...</div>
	if (error) return <div>Erreur : {error.message}</div>

	const datas = []

	for (let i = 0; i < data.length; i++) {
		datas[i] = data[i].username
	}

	return <div>{datas.map(todo => (<li key={todo}>{todo}</li>))}</div>
}


const tabsData = [
	{
		tabTitle: "Statistiques",
		tabHeading: "oui les stats",
		txt: <QueryClientProvider client={queryClient}>
				<FetchName />
			</QueryClientProvider>,
		url: "/statistics"
	},
	{
		tabTitle: "Paramètres",
		tabHeading: "oui les paramètres",
		txt: <>
			<li>Changer difficulté de jeu</li>
			<li>Changer langue de jeu</li>
			<li>Trouver de nouveaux paramètres à modifier</li>
		</>,
		url: "/parameters"
	},
	{
		tabTitle: "Recettes",
		tabHeading: "oui les recettes",
		txt: "Ceci être le placeholder des recettes",
		url: "/recipes"
	},
	{
		tabTitle: "Règles du jeu",
		tabHeading: "oui les règles",
		txt: "Ceci être le placeholder des règles",
		url: "/rules"
	}
]

export { tabsData }
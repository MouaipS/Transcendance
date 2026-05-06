import { QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query'

const queryClient = new QueryClient()

const RulesCard = () => (
	<div className="text-sm space-y-2">
		<p>Le but : <span className="font-bold">accumuler le plus de points</span> 
			en remportant des plis.</p>
		<p>Façons de gagner un pli :</p>
		<ul className="list-disc ml-5 space-y-1">
			<li>Smasher en cas de paire</li>
			<li>Smasher en cas de sandwich</li>
			<li>Smasher un combo</li>
			<li>Remplir son récipient</li>
		</ul>
	</div>
)

const StatsCard = () => {
	const {data, error, isLoading} = useQuery({
		queryKey: ['stat'],
		queryFn: () =>
			fetch('/api/home', {credentials: 'include'})
				.then(res => res.json())
	})

	if (isLoading) return <div className="text-gray-500 italic">Chargement</div>
	if (error) return <div>Erreur</div>
	if(!data || !data.stats) return <div>Aucune donnée</div>

	const ratio = data.stats.nb_defeats === 0 ? (data.stats.nb_victories > 0 ? "∞" : "0") : (data.stats.nb_victories / data.stats.nb_defeats).toFixed(2)

	const Row = ({ label, value }) => (
		<div className="flex items-center justify-between 
			border border-slate-400 px-4 py-2">
			<span className="font-semibold text-gray-700">{label}</span>
			<span className="font-bold text-lg">{value}</span>
		</div>
	)

	return <div className="flex flex-col gap-2">
		<Row label="RANK" value={data.stats.rank}/>
		<Row label="VICTOIRES" value={data.stats.nb_victories}/>
		<Row label="DEFAITES" value={data.stats.nb_defeats}/>
		<Row label="RATIO V/D" value={ratio}/>
		<Row label="MATCHS JOUÉS" value={data.stats.nb_games}/>
	</div>
}

const RecipesCard = () => {

	const recipes = [
		{ name: 'Recette A', ingredients: ['navet', 'carotte'] },
		{ name: 'Recette B', ingredients: ['concombre', 'cheval'] },
		{ name: 'Recette C', ingredients: ['poivron', 'oignon', 'tomate'] },
		{ name: 'Recette C', ingredients: ['poivron', 'oignon', 'tomate'] },
	]

	return <div className="space-y-3">
		{recipes.map((r, i) => (
			<div key ={i}>
				<p className="font-bold text-lg">
					{r.name} :
				</p>
				<ul className="ml-4 text-sm">
					{r.ingredients.map((ing, j) => (
						<li key={j}>
							|→ {ing}
						</li>
					))}
				</ul>
			</div>
		))}
	</div>
}

const ChatCard = () => (
	<div className="text-gray-500 italic">
		Chat en cours de développement...
	</div>

)

const BrigadeCard = () => {
	const member = [
		{name : 'Jean', status: 'online'},
		{name : 'Jeanne', status: 'in-game'},
		{name : 'Jul', status: 'offline'},
	]

	const statusColor = {
		'online': 'bg-green-500',
		'in-game': 'bg-yellow-500',
		'offline': 'bg-gray-400',
	}

	return <div className="flex flex-col gap-2">
		{member.map((m, i) => (
			<div key={i} className="flex items-center gap-3 border border-slate-400 px-3 py-2">
				<span className={`h-3 w-3 rounded-full ${statusColor[m.status]}`}></span>
				<span className="font-semibold">{m.name}</span>
				<span className="ml-auto text-xs text-gray-500 italic">{m.status}</span>
			</div>
		))}
	</div>
}


//tbleau avec les fiches de la pile
const cardsData = [
	{
		title: "Un peu de stats dans votre plat ?",
		content: <QueryClientProvider client={queryClient}>
				<StatsCard />
			</QueryClientProvider>,
	},
	{
		title: "Puis-je prendre votre commande ?",
		content: <ChatCard/>,
	},
	{
		title: "Les recettes du jour",
		content: <RecipesCard/>,
	},
	{
		title: "Les règles en cuisine",
		content: <RulesCard/>,
	},
	{
		title: "La brigade",
		content: <BrigadeCard/>,
	}
]




export {cardsData}
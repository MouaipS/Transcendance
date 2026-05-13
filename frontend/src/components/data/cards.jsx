import { QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ChatCard } from '../tools/ChatCard'

const queryClient = new QueryClient()

const RulesCard = () => (
	<div className="text-sm text-amber-300 text-justify space-y-2">
		<p>
			Objectif : <span className="font-caprasimo text-amber-300">
				accumuler le plus de points
			</span> en remportant des plis.</p>
		<p>
			Façons de gagner un pli :
		</p>
		<ul className="list-disc ml-6 space-y-2 text-amber-300">
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

	if (isLoading) return <div className="text-amber-200/70 italic">Chargement</div>
	if (error) return <div className="text-red-400">Erreur</div>
	if(!data || !data.stats) return <div className="text-amber-200/70 italic">Aucune donnée</div>

	const ratio = data.stats.nb_defeats === 0 ? (data.stats.nb_victories > 0 ? "∞" : "0") : (data.stats.nb_victories / data.stats.nb_defeats).toFixed(2)

	const Row = ({ label, value }) => (
		<div className="flex items-center justify-between 
			border-2 border-stone-900 bg-amber-50 px-4 py-2">
			<span className="font-bold text-xs uppercase tracking-[0.2em] text-stone-700">{label}</span>
			<span className="font-caprasimo text-xl text-stone-900">{value}</span>
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
				{ name: 'Recette A', ingredients: ['navet', 'carotte'] },
		{ name: 'Recette B', ingredients: ['concombre', 'cheval'] },
		{ name: 'Recette C', ingredients: ['poivron', 'oignon', 'tomate'] },
		{ name: 'Recette C', ingredients: ['poivron', 'oignon', 'tomate'] },
	]

	return <div className="space-y-3">
		{recipes.map((r, i) => (
			<div key ={i}>
				<p className="font-caprasimo text-lg text-amber-300">
					{r.name} :
				</p>
				<ul className="ml-4 text-sm text-amber-300">
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

const BrigadeCard = () => {
	const navigate = useNavigate()
	const member = [

	]
	
	//const member = []

	const statusColor = {
		'online': 'bg-green-500',
		'in-game': 'bg-yellow-500',
		'offline': 'bg-gray-400',
	}

	if(member.length === 0) {
		return <div className="flex flex-col items-center text-center justify-center h-full min-h-32 gap-4 py-4">
			<p className="text-base text-amber-300">T'as besoin de recruter des membres dans ta brigade, chef !</p>
			<button
				onClick={() => navigate('/profile', {state: {tab: 'friends'}})}
				className="bg-amber-300 border-2 border-stone-900 px-4 py-2 text-xs text-stone-900 font-bold uppercase hover:bg-state-100 transition-all">
					Gérer les amis
			</button>
		</div>
	}

	return <div className="flex flex-col gap-2">
		{member.map((m, i) => (
			<div key={i} className="flex items-center gap-3 border-2 border-stone-900 bg-amber-50 px-3 py-2">
				<span className={`h-3 w-3 rounded-full order border-stone-900 ${statusColor[m.status]}`}></span>
				<span className="font-caprasimo text-lg text-stone-900">{m.name}</span>
				<span className="ml-auto text-xs uppercase tracking-[0.2em] text-stone-700 font-bold">{m.status}</span>
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
		content: <QueryClientProvider client={queryClient}>
            <ChatCard/>
        </QueryClientProvider>,
	},
	{
		title: "Les recettes du jour",
		content: <RecipesCard/>,
	},
	{
		title: "Les règles en cuisine",
		content: <RulesCard/>,
		seeMore: "/rules"
	},
	{
		title: "La brigade",
		content: <BrigadeCard/>,
	}
]




export {cardsData}
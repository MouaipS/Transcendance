

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

const StatsCard = () => (
	<div className="text-gray-500 italic">
		Stats en cours de développement...
	</div>

)

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
				<span className="font-seimbold">{m.name}</span>
				<span className="ml-auto text-xs text-gray-500 italic">{m.status}</span>
			</div>
		))}
	</div>
}


//tbleau avec les fiches de la pile
const cardsData = [
	{
		title: "Un peu de stats dans votre plat ?",
		content: <StatsCard/>,
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
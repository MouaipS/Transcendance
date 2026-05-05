

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

const BrigadeCard = () => (
	<div className="text-gray-500 italic">
		Stats en cours de développement...
	</div>

)


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
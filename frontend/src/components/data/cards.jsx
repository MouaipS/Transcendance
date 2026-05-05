

const RulesCard = () => (
	<div className="text-gray-500 italic">
		Stats en cours de développement...
	</div>
)

const StatsCard = () => (
	<div className="text-gray-500 italic">
		Stats en cours de développement...
	</div>

)

const RecipesCard = () => (
	<div className="text-gray-500 italic">
		Stats en cours de développement...
	</div>

)

const ChatCard = () => (
	<div className="text-gray-500 italic">
		Stats en cours de développement...
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
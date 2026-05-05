import { cardsData } from "../data/cards";

export default function CardStack () {
	const card = cardsData[0];

	return <div className="max-w-87.5 border border-slate-400 p-4 mt-4">
			<h3 className="font-serif text-lg mb-2"> {card.title}</h3>
			<div>{card.content}</div>
		</div>
}	
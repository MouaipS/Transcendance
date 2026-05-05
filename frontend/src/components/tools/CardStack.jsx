import { cardsData } from "../data/cards";

export default function CardStack () {
	const card = cardsData[0];

	return <div className="relative max-w-87.5 mt-4">

			{/**les fiches en fond */}
			{[1, 2, 3].map((index) => (
				<div 
					key={index}
					className="absolute inset-0 border border-slate-400 bg-white"
					style={{
						transform: `translate(${index * 6}px, ${index * 6}px)`,
						zIndex: 10 - index,
					}}
					/>
			))}

			{/**fiche premier plan */}
			<div
				className="relative border border-slate-400 bg-white p-4"
				style={{
					zIndex: 20
				}}
			>
			<h3 className="font-serif text-lg mb-2"> {card.title}</h3>
			<div>{card.content}</div>
			</div>
		</div>
}	
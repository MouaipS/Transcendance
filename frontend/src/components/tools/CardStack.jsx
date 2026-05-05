import { cardsData } from "../data/cards";
import { useState } from "react"

export default function CardStack () {
	const [ activeIndex, setActiveIndex ] = useState(0)
	const total = cardsData.length
	const card = cardsData[activeIndex]

	const nextCard = () => setActiveIndex((prev) => (prev + 1) % total)
	const prevCard = () => setActiveIndex((prev) => (prev -1 + total )% total)

	return <div className="relative max-w-87.5 mt-4">

			{/**les fiches en fond */}
			{[1, 2, 3].map((index) => {
				const idx = (activeIndex + index) % total
				return (
				<div 
					key={index}
					onClick={() => setActiveIndex(idx)}
					className="absolute inset-0 border border-slate-400 bg-white cursor-pointer hover:bg-slate-50"
					style={{
						transform: `translate(${index * 6}px, ${index * 6}px)`,
						zIndex: 10 - index,
					}}
					arial-label={`Aller à la fiche ${cardsData[idx].title}`}
					/>
			)
	})}

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
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
				<div className="flex items-center justify-between mb-1">
					<h3 className="font-serif text-lg mb-2"> {card.title}</h3>
					<span className="text-xs text-gray-400 font-mono">
						{activeIndex + 1} / {total}
					</span>
				</div>
				<div className="border-b border-gray-300 mb-3"></div>
				<div>{card.content}</div>
				<div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
					<button 
						onClick={prevCard}
						className="px-3 py-1 border border-slate-400 bg-white hover:bg-slate-100 text-lg font-bold">
							←
					</button>
					<div className="flex gap-1.5">
						{cardsData.map((_, i) => (
							<button
								key={i}
								onClick={() => setActiveIndex(i)}
								className={`h-2 w-2  border border-slate-400 
									${	i === activeIndex ? 'bg-slate-700' : 'bg-white hover:bg-slate-200'}`}
								arial-label={`Aller à la fiche ${i+1}`}
							/>
						))}
					</div>
					<button 
						onClick={nextCard}
						className="px-3 py-1 border border-slate-400 bg-white hover:bg-slate-100 text-lg font-bold">
							→
						</button>
				</div>
			</div>
		</div>
}	
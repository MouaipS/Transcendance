import { cardsData } from "../data/cards";
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CardStack () {
	const navigate = useNavigate()

	const [ activeIndex, setActiveIndex ] = useState(0)
	const total = cardsData.length
	const card = cardsData[activeIndex]

	const nextCard = () => setActiveIndex((prev) => (prev + 1) % total)
	const prevCard = () => setActiveIndex((prev) => (prev -1 + total )% total)

	return <div className="relative flex-1 mt-4 mb-10 min-h-0 w-full">

			{/**les fiches en fond */}
			{[1, 2, 3].map((index) => {
				const idx = (activeIndex + index) % total
				return (
				<div 
					key={index}
					onClick={() => setActiveIndex(idx)}
					className="absolute inset-0 bg-stone-300  bg-background/80 border-2 border-primary shadow-md cursor-pointer hover:bg-secondary-light transition-colors"
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
				className="absolute inset-0 bg-primary border-2 border-primary shadow-[3px_3px_0_0_rgba(28,25,23,1)] p-4 flex flex-col"
				style={{
					zIndex: 20
				}}
			>
				<div className="flex items-center justify-between mb-1 shrink-0">
					<h3 className="font-caprasimo text-sm uppercase tracking-[0.2em] text-secondary">
						{card.title}
					</h3>
					<span className="text-xs text-secondary font-bold font-mono">
						{activeIndex + 1}/{total}
					</span>
				</div>
				<div className="h-px bg-amber-400/40 mb-3 shrink-0"></div>
				<div className="flex-1 min-h-0 overflow-auto text-background">
					{card.content}
				</div>
				{card.seeMore && (
				    <button
				        onClick={() => navigate(card.seeMore)}
				        className="mt-4 mx-auto bg-secondary 
				            px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] 
				            text-primary border-2 border-primary
				            shadow-[2px_2px_0_0_rgba(28,25,23,1)]
				            hover:bg-amber-400 hover:-translate-y-0.5 
				            transition-all shrink-0"
				    >
				        Voir plus
				    </button>
				)}

				<div className="flex justify-between items-center mt-3 pt-2 border-t border-amber-400/30 shrink-0">
					<button 
						onClick={prevCard}
						className="px-3 py-1 border-2 border-primary bg-background text-primary text-lg font-bold
					hover:bg-secondary-light hover:-translate-y-0.5 transition-all">
							←
					</button>
					<div className="flex gap-1.5">
						{cardsData.map((_, i) => (
							<button
								key={i}
								onClick={() => setActiveIndex(i)}
								className={`h-2.5 w-2.5  rounded-full border transition-colors
									${	i === activeIndex ? 'bg-secondary border-primary' : 'bg-primary-light border-amber-400/40 hover:bg-stone-600'}`}
								arial-label={`Aller à la fiche ${i+1}`}
							/>
						))}
					</div>
					<button 
						onClick={nextCard}
						className="px-3 py-1 border-2 border-primary bg-background text-primary text-lg font-bold
					hover:bg-secondary-light hover:-translate-y-0.5 transition-all">
							→
						</button>
				</div>
			</div>
		</div>
}	
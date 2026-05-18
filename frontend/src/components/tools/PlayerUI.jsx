const packs = ["src/components/images/Cards/cardDos.png",
			   "src/components/images/Cards/paquet_right.png", 
			   "src/components/images/Cards/paquet_bottom.png", 
			   "src/components/images/Cards/paquet_left.png"]

export const PlayerUI = ({ players, decks, score, player, index }) => {
	
	const background = (player === index ? "bg-yellow-400" : "bg-white")
	const angle = index * 90 + 180
	
	return <>
	<button
		className={`flex items-center gap-6 rounded-md border border-black 
		shadow-md text-sm font-medium text-gray-700 mt-6 
		focus:outline-none min-w-40 max-h-14.5 ${background}`}
		>
		<img
			alt="avatar par défaut"
			src="src/components/images/default_avatar.webp"
			className="h-14 w-14 object-cover rounded-s-lg"
		/>
		<span className="pr-4 text-2xl">{players}</span>
	</button>

	<div className="relative flex items-center justify-center">
	<img
		alt="paquet de cartes"
		src="src/components/images/Cards/cardDos.png"
		className="h-30"
		style={{ transform: `rotate(${angle}deg)` }}
	/>
	
	<span className="absolute text-white font-bold text-2xl shadow-sm">
		{decks}
	</span>
	</div>

	<div>{score}</div>
	</>
}
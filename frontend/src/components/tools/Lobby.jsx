export function Lobby({ handleJoin, handleCreate, code, setCode }) {
	return (
		<div className="flex flex-col gap-30 px-8 py-12 max-w-2xl mx-auto h-full justify-center">
			<button 
				className=" bg-amber-300 px-8 py-6 text-stone-900 font-caprasimo text-3xl uppercase tracking-[0.2em] 
					border-2 border-stone-900 shadow-[4px_4px_0_0_rgba(28,25,23,1)] hover:bg-amber-400 hover:-translate-y-1 
					hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)] active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(28,25,23,1)]
					transition-all"
				onClick={handleJoin}>
				JOIN PUBLIC GAME
			</button>

			<form 
				className=" bg-amber-50 px-8 py-6 border-2 border-stone-900shadow-[4px_4px_0_0_rgba(28,25,23,1)]hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)]
							transition-all flex flex-col items-center gap-4"
				onSubmit={handleJoin}>
				<span className=" font-caprasimo text-2xl uppercase tracking-[0.2em] 
									text-stone-900">
					JOIN PRIVATE GAME
				</span>
				<div className="flex items-end gap-2 mb-1">
					<span className=" text-[10px] uppercase tracking-[0.3em] 
										font-bold text-stone-700 pb-1">
						CODE :
					</span>
					<input
						id="code"
						name="code"
						required
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder="XXXXXXXXX"
						className=" text-center bg-amber-100/60 
									border-2 border-stone-900 px-3 py-1.5 text-xl font-mono tracking-[0.3em] text-stone-900placeholder:text-stone-400 focus:bg-amber-100 
									focus:outline-none w-48"
					/>
				</div>
				<button 
					type="submit"
					className=" bg-stone-900 px-5 py-1.5 
								text-amber-50 text-xs font-bold uppercase tracking-[0.3em]
								border-2 border-stone-900
								hover:bg-stone-800 hover:-translate-y-0.5 transition-all">
					Rejoindre
				</button>
			</form>

			<button 
				className=" bg-stone-900 px-8 py-6 text-amber-50 font-caprasimo text-3xl uppercase tracking-[0.2em] 
					border-2 border-stone-900 shadow-[4px_4px_0_0_rgba(28,25,23,1)]hover:bg-stone-800 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)]
					active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(28,25,23,1)]
					transition-all"
				onClick={handleCreate}>
				CREATE GAME
			</button>
		</div>
	)
}
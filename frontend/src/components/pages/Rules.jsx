import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import carotImg        from '../images/carot.png'
import poivronImg      from '../images/poivron.png'
import legumesImg      from '../images/legumes.png'
import cuttingboardImg from '../images/cuttingboard.png'

const queryClient = new QueryClient()

const rulesTab = () => {
	
}

const cardsTab = () => {

}

const receipesTab = () => {

}

const PageContent = () => {
	const navigate = useNavigate()
	const [actifTab, setActifTab] = useState('stats')

	return (
		<div className="px-8 pb-8">
			<Tabs actifTab={actifTab} onChange={setActifTab} />
			{actifTab ==='rules' && <rulesTab/>}
			{actifTab ==='cards' && <cardsTab/>}
			{actifTab ==='receipes' && <receipesTab/>}
		</div>
	)
}

const Tabs = ({actifTab, onChange}) => {
	const tab = [
		{id: 'rules', label: 'RULES' },
		{id: 'cards', label: 'CARDS' },
		{id: 'receipes', label: 'RECEIPES'},
	]

	return (
		<div className="flex gap-3 mb-8 animate-slide-in-left">
			{tab.map((tabN) => {
				const isActif = actifTab === tabN.id

				const baseClass = "flex-1 px-6 py-3 border-2 border-stone-900 font-bold text-xs sm:text-sm uppercase tracking-[0.3em] transition-all duration-200 hover:-translate-y-0.5"
				const variantClass = isActif ? 'bg-amber-300 text-stone-900 shadow-[3px_3px_0_0_rgba(28,25,23,1)]' : 'bg-amber-50/80 text-stone-900 hover:bg-amber-100'

				return (
					<button
						key={tabN.id}
						onClick={() => onChange(tabN.id)}
						className={`${baseClass} ${variantClass}`} >
								{tabN.label}
					</button>
				)
			})}
		</div>
	)
}

export function Rules() {
	const navigate = useNavigate()
	return<>
		<QueryClientProvider client={queryClient}>
			<div className="absolute inset-0 min-h-full bg-amber-50 overflow-y-auto">
				<div className="max-w-6xl mx-auto px-8 py-12">
					<button
						onClick={() =>navigate('/')}
						className="	group inline-flex items-center gap-2 mb-8
									text-stone-900 hover:text-stone-700
									transition-colors animate-slide-in-left">
						<span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
						<span className="text-xs uppercase tracking-[0.3em] font-bold">Retour en cuisine</span>
					</button>
					<header className="mb-12 animate-slide-in-left">
						<div className="flex items-center gap-3 mb-3">
							<div className="text-xs uppercase tracking-[0.4em] font-bold text-stone-700">gauche</div>
							<div className="flex-1 h-px bg-stone-900/30"/>
							<div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-700">Droite</div>
						</div>
						<h1 className="	font-caprasimo text-stone-900 leading-[0.85]
										text-7xl sm:text-8xl lg:text-[10rem]
										tracking-tighter">
							Rules
						</h1>
						<div className="mt-4 h-1 bg-stone-900"/>
						<p className="mt-4 text-stone-700 italic max-w-2xl text-sm sm:text-base">
							
						</p>
						<p className="mt-2 text-stone-700 italic max-w-4xl text-sm sm:text-base">
						" Il est venu à moi, l'Anneau Unique. Il sera l'Héritage de mon royaume. Tous mes descendants seront liés à son destin aussi ne me risquerai-je pas à faire de mal à l'Anneau. Il m'est très précieux, bien que je l'ai acquis avec souffrance. Les inscriptions sur son contour commencent à s'effacer. L'écriture qui au début était aussi lumineuse qu'une flamme rougeoyante a presque disparu. C'est un secret qu'aujourd'hui seul les flammes peuvent révéler. "
						</p>
						<p className="mt-2 text-stone-700 italic max-w-4xl text-sm sm:text-base">
						Comme quoi c'est souvent utile de lire les archives, les parchemins et les règles. Tu trouveras tout ce qu'il te faut ici pour comprendre vaincre tes adversaires.
						</p>
					</header>
				</div>
				<PageContent/>
			</div>
		</QueryClientProvider>
	</>
}
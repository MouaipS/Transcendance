import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import carotImg        from '../images/carot.png'
import poivronImg      from '../images/poivron.png'
import legumesImg      from '../images/legumes.png'
import cuttingboardImg from '../images/cuttingboard.png'

const queryClient = new QueryClient()

const SectionTitle = ({ children, number, icon, subtitle }) => (
	<div className="pt-16 pb-8 animate-slide-in-left">
		<div className="flex items-end gap-4 mb-3">
			<div className="font-caprasimo text-4xl sm:text-6xl text-stone-900 leading-none">
				№{number}
			</div>
			<div className="flex-1 pb-2">
				<div className="h-[3px] bg-stone-900 w-full animate-slide-in-left" />
			</div>
			{icon && (
				<img src={icon} alt="" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
			)}
		</div>
		<div className="flex items-baseline gap-3">
			<h2 className="font-caprasimo text-3xl sm:text-5xl tracking-wide text-stone-900">
				{children}
			</h2>
			{subtitle && (
				<span className="italic text-stone-700/70 text-sm sm:text-base">
					— {subtitle}
				</span>
			)}
		</div>
	</div>
)

const RulesTab = () => (
	<div>

		<SectionTitle number="0" icon={legumesImg} subtitle="L'appetit">
			Conditions de victoires
		</SectionTitle>
		<p className="text-stone-700 leading-relaxed max-w-3xl">
			Le but du jeu est d'avoir le score le plus élevé à la fin du temps impartis ou bien d'avoir récuperer l'ensemble des cartes du jeu.
			Le jeu s'arrête à ces seuls conditions - ainsi ne plus avoir de cartes ne signifie pas ne plus pouvoir jouer.
		</p>


		<SectionTitle number="I" icon={legumesImg} subtitle="avant le service">
			MISE EN PLACE ET DEROULEMENT D'UN PLI
		</SectionTitle>
		<p className="text-stone-700 leading-relaxed max-w-3xl">
			Chaque joueur commence la partie avec un paquet identique de cartes, mélangé aléatoirement.
			Tour à tour, les joueurs retournent la première carte de leur deck au centre de la zone de
			jeu — et ce jusqu'à ce que l'un d'entre eux remporte le pli. Il existe deux manières d'y
			parvenir : remplir un récipient ou réussir un smash.
			Un paquet de carte se compose de 13 ingrédients (10 legumes, 3 viandes), 4 recipients et quelques légumes douteux.
		</p>

		<SectionTitle number="II" icon={legumesImg} subtitle="remplir son récipient">
			RÉCIPIENT
		</SectionTitle>
		< p className="text-stone-700 leading-relaxed max-w-3xl">
			Lorsqu'un joueur retourne une carte <strong>Récipient</strong>, le joueur suivant devient
			son <strong>commis</strong>. Le commis doit remplir ce Récipient en tirant autant de cartes
			Ingrédients que requis. Si une carte Récipient est tirée à la place d'un ingrédient, le joueur suivant
			reprend le rôle de commis pour ce nouveau Récipient — et ainsi de suite jusqu'à ce qu'un
			Récipient soit entièrement rempli ou qu'un smash soit réussi.
		</p>

		<SectionTitle number="III" icon={legumesImg} subtitle="taper du poing sur la table">
			SMASH
		</SectionTitle>
		< p className="text-stone-700 leading-relaxed max-w-3xl">
			À tout moment du pli, lorsque les conditions sont remplies, tous les joueurs peuvent
			smasher — c'est-à-dire être le premier à appuyer sur <kbd className="px-2 py-0.5 border border-stone-400 bg-stone-100 text-xs font-mono rounded">Entrée</kbd>.
			Le premier qui smash remporte le pli et l'ensemble des cartes. Les conditions pour smasher sont les recettes.
		</p>

		<SectionTitle number="III" icon={legumesImg} subtitle="chaud devant">
			RECETTE
		</SectionTitle>
		< p className="text-stone-700 leading-relaxed max-w-3xl">
			Une recette est une liste d'ingrédients qui forme un combo lorsqu'ils se suivent. L'ordre n'a pas d'importance tant que la série n'est pas interrompu par un ingrédient en trop.
			Pour faire simple : lorsque tous les ingrédients qui la composent sont tirés les uns à la
			suite des autres, dans n'importe quel ordre. Le premier à smasher remporte le pli et réalise
			la recette. 
		</p>
		<p className="mt-4 text-stone-700 leading-relaxed max-w-3xl">
			La liste des recettes disponibles pour la partie, ainsi que leurs ingrédients et leurs
			pouvoirs, est affichée dans le menu situé à gauche de la zone de jeu. Il est impératif de la consulter dès le début de la partie.
			Tu peux retruver l'ensemble des recettes dans l'onglet <kbd className="px-2 py-0.5 border border-stone-400 bg-stone-100 text-xs font-mono rounded">RECIPES</kbd>.
		</p>

		<SectionTitle number="III" icon={legumesImg} subtitle="le pot pourris">
			LEGUMES POURRIS
		</SectionTitle>
		< p className="text-stone-700 leading-relaxed max-w-3xl">
			parmis les ingredients du jeu, on peut tomber sur des légumes plus tres frais. Attention à ne pas faire de recettes avec, il se pourrait qu'ils ne vous apportent aucun bienfait.
		</p>

	</div>
	
)

const CardsTab = () => (
	<div className="pt-8 text-stone-700 italic">À venir…</div>

)

const RecipesTab = () => (
	<div className="pt-8 text-stone-700 italic">À venir…</div>
)

const PageContent = () => {
	const navigate = useNavigate()
	const [actifTab, setActifTab] = useState('rules')

	return (
		<div className="px-8 pb-8">
			<Tabs actifTab={actifTab} onChange={setActifTab} />
			{actifTab ==='rules' && <RulesTab/>}
			{actifTab ==='cards' && <CardsTab/>}
			{actifTab ==='recipes' && <RecipesTab/>}
		</div>
	)
}

const Tabs = ({actifTab, onChange}) => {
	const tab = [
		{id: 'rules', label: 'RULES' },
		{id: 'cards', label: 'CARDS' },
		{id: 'recipes', label: 'RECIPES'},
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
						Comme quoi c'est souvent utile de lire les archives, les parchemins et les règles. Tu trouveras tout ce qu'il te faut ici pour comprendre comment vaincre tes adversaires.
						</p>
					</header>
				</div>
				<PageContent/>
			</div>
		</QueryClientProvider>
	</>
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import carotImg        from '../images/carot.png'
import poivronImg      from '../images/poivron.png'
import legumesImg      from '../images/legumes.png'
import cuttingboardImg from '../images/cuttingboard.png'


// Utilisé pour fetch depuis le back,
// oui c'est encore un autre plug-in...
const queryClient = new QueryClient()

const SectionTitle = ({ children, number, icon, subtitle}) => (
	<div className="pt-16 pb-8 animate-slide-in-left">
		<div className="flex items-end gap-4 mb-3">
			<div className="font-caprasimo text-5xl sm:text-6xl
							text-stone-900 leading-none">
				№{number}
			</div>
			<div className="flex-1 pb-2">
				<div className="h-[3px] bg-stone-900 w-full animate-slide-in-left" />
			</div>
			{icon && (<img src={icon} alt=""
					className="h-10 w-10 sm:h-12 sm:w-12 object-contain"/>)}
		</div>
		<div className="flex items-baseline gap-3">
			<h2 className="	font-caprasimo text-3xl sm:text-5xl
							tracking-wide text-stone-900">
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

const StatCard = ({label, value, index = 0, isHighlighted = false}) => {
	const wrapperClass = isHighlighted ? 'bg-stone-900 border-stone-900' : 'bg-amber-50/80 border-stone-900'

	const numberClass = isHighlighted ? 'text-amber-400/70' : 'text-stone-900/40'

	const valueClass = isHighlighted ? 'text-4xl sm:text-5xl lg:text-6xl text-amber-50' : 'text-3xl sm:text-4xl lg:text-5xl text-stone-900'

	const dividerClass = isHighlighted ? 'bg-amber-400/60' : 'bg-stone-900/40'

	const labelClass = isHighlighted ? 'text-amber-200/90' : 'text-stone-900/70'

	const cardNumber = String(index + 1).padStart(2, '0')

	return(
		<div className={`relative border-2 overflow-hidden
						transition-all duration-200 hover:-translate-y-1
						animate-fade-in-up
						${wrapperClass}`}
		style={{animationDelay: `${index*60}ms`}}>
			<div className={`absolute top-2 left-3 text-[10px]
							font-bold tracking-widest
							${numberClass}`}>
					№{cardNumber}
			</div>

			<div className="p-5 pt-8 flex flex-col justify-between min-h-36">
				<div className={`text-center font-caprasimo
								break-words leading-none
								${valueClass}`}>
						{value}
				</div>

				<div className={`mx-auto mt-3 mb-2 h-px w-8
								${dividerClass}`} />
				<div className={`text-[11px] sm:text-xs text-center
								font-bold mt-1 uppercase tracking-[0.2em]
								${labelClass}`}>
					{label}
				</div>
			</div>
		</div>
	)
}

// Requête GET pour récupérer les infos depuis la DB afin
// d'afficher les statistiques de l'utilisateur dans l'onglet stats
const FetchStats = () => {

	const navigate = useNavigate()
	
	const { data, error, isLoading } = useQuery({
		queryKey: ['stats'],
		queryFn: () => 
			fetch('/api/home', {
				method: 'GET',
				credentials: 'include'
			})
			.then(res => {
				if (res.status === 401) {
					navigate('/login')
					throw new Error('Not authentificate user')
				}
				return res.json()
			})
	})

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error : {error.message}</div>
	if (!data || !data.stats) return <div>None data found</div>
 

	const s = data.stats //raccourci

	const calcWinRate = s.nb_games > 0 ? Math.round((s.nb_victories / s.nb_games) * 100) : 0
	const changeNone = (str) => str && str !== "None" ? str : "-"
	const smashAccuracy = s.nb_smash > 0 ? Math.round((s.nb_smash_success / s.nb_smash) * 100): 0

	return <div className="px-8 pb-8">
		<div className="border-2 border-stone-900 bg-amber-50/60 p-6 sm:p-10 mb-4 animate-slide-in-left">
			<div className="text-[10px] sm:text-xs uppercase tracking-[0.3em]
							text-stone-700 font-bold mb-2">
								Fiche du chef - Service en cours
			</div>
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
				<h2 className="	font-caprasimo text-5xl sm:text-7xl
								text-stone-900 leading-none">
					{data.username}
				</h2>
				<div className="text-right">
					<div className="font-caprasimo text-4xl sm:text-5xl text-stone-900">
						{s.rank} /
						<span className="text-stone-700/40">
							/ {s.rank_max}
						</span>
					</div>
					<div className="text-[10px] uppercase tracking-[0.2em]
									text-stone-700 font-bold mt-1">
						Rang actuel // Meilleur
					</div>
				</div>
			</div>
		</div>
		{/* ===== PARTIES ===== */}
		<SectionTitle number="I" icon={poivronImg} subtitle={"bilan de la brigade"}>GAMES</SectionTitle>
		<div className="grid grid-cols-4 gap-4">
			<StatCard label="Matchs joués" value={s.nb_games}     index={0} />
			<StatCard label="Victoires"    value={s.nb_victories} index={1} />
			<StatCard label="Défaites"     value={s.nb_defeats}   index={2} />
			<StatCard label="Ratio V/D"    value={`${calcWinRate}%`} index={3} isHighlighted />
		</div>

		{/* ===== RECORDS ===== */}
		<SectionTitle number="II" icon={legumesImg} subtitle={"spécialités du chef"}>RECORDS</SectionTitle>
		<div className="grid grid-cols-3 gap-4">
			<StatCard label="Rang actuel"        value={s.rank}                     index={4} isHighlighted />
			<StatCard label="Meilleur rang"      value={s.rank_max}                 index={5} isHighlighted />
			<StatCard label="Heures de jeu"      value={s.hours_played}             index={6} />
			<StatCard label="Série de victoires" value={s.max_win_streak}           index={7} />
			<StatCard label="Série de défaites"  value={s.max_loose_streak}         index={8} />
			<StatCard label="Smashs consécutifs" value={s.max_smash_success_streak} index={9} />
		</div>

		{/* ===== SMASH ===== */}
		<SectionTitle number="III" icon={carotImg} subtitle={"techniques du chef"}>SMASH</SectionTitle>
		<div className="grid grid-cols-3 gap-4">
			<StatCard label="Nombre de smashs"  value={s.nb_smash}                       index={10} />
			<StatCard label="Smashs réussis"    value={s.nb_smash_success}               index={11} />
			<StatCard label="Précision"         value={`${smashAccuracy}%`}              index={12} isHighlighted />
			<StatCard label="Réaction moyenne"  value={`${s.avg_reaction_ms} ms`}        index={13} />
			<StatCard label="Meilleur combo"    value={changeNone(s.most_combo_smash)}   index={14} />
			<StatCard label="Carte smashée"     value={changeNone(s.most_smashed_card)}  index={15} />
		</div>

		{/* ===== DIVERS ===== */}
		<SectionTitle number="IV" icon={cuttingboardImg} subtitle={"les petits plus"}>DIVERS</SectionTitle>
		<div className="grid grid-cols-2 gap-4">
			<StatCard label="Carte favorite" value={changeNone(s.favorite_card)} index={16} />
			<StatCard label="Bonus joués"    value={s.nb_bonus_played}           index={17} />
		</div>
	</div>
}

export function Profile () {
	const navigate = useNavigate()
	return <>
		<QueryClientProvider client={queryClient}>
			{/*wrappeur exterieur - prend tout l'ecran et donne le fond
				inset-0 pour recouvrir tout l'ecran
				min-h-full permet le scroll vertical car affichage à 100%
				bg-amber-50 couleur du fond
				overflow-y-auto active le scroll vertical
				*/}
			<div className="absolute inset-0 min-h-full bg-amber-50 overflow-y-auto">
				{/* wrappeur interieur
					max-w-6xl limite de largeur pour la lisibilité - environ 100 caracteres par ligne
					mx-auto pour le centrage horizontal
					px-8 py-12 pour le padding - on le fait asymétrique pour avoir plus d'espace en vertical
				*/}
				<div className="max-w-6xl mx-auto px-8 py-12">

						{/* class du bouton
							group pour le declarer group parent, les enfants peuvent utiliser group-hover pir gerer le survol
							inline-flex : le button se comporte simplement comme un element en ligne de taille du contenu
							items-center : centre les enfants
							gap-2 : espace entre les 2 enfants
							mb-8 : espace entre le button et la suite
							text-stone-900 c'est la couleur du texte
							hover:text-stone-700 : modification de la couleur en cas de survol
							transition-colors : gestion de la transition de couleurs
							 */}
						{/* class de la fleche 
							text-2xl : taille de la fleche
							group-hover:-translate-x-1 : heritage du parents + translation de 4 pxl
							transition-transform geston de la transition
						 */}
						{/* class du texte
							text-xs taille du texte
							uppercase : tout en maj
							tracking-[0.3em] : espace des lettres
							font-bold : mettre en gras
							 */}
					<button
						onClick={() => navigate('/')}

						className="	group inline-flex items-center gap-2 mb-8
									text-stone-900 hover:text-stone-700
									transition-colors animate-slide-in-left">
						<span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
						<span className="text-xs uppercase tracking-[0.3em] font-bold">Retour en cuisine</span>
					</button>
					{/*class header
						mb-12 : espace entre le header et la premiere section */}
					{/*flex container : pour la gestion des alignements avec les enfants*/}
					<header className="mb-12 animate-slide-in-left">
						<div className="flex items-center gap-3 mb-3">
							<div className="text-xs uppercase tracking-[0.4em] font-bold text-stone-700">gauche</div>
							<div className="flex-1 h-px bg-stone-900/30"/>
							<div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-700">Droite</div>
						</div>
						<h1 className="	font-caprasimo text-stone-900 leading-[0.85]
										text-7xl sm:text-8xl lg:text-[10rem]
										tracking-tighter">
							Profile
						</h1>
						<div className="mt-4 h-1 bg-stone-900"/>
						<p className="mt-4 text-stone-700 italic max-w-2xl text-sm sm:text-base">
							Le récapitulatif de toute ta carrière de chef :
						</p>
						<p className="mt-2 text-stone-700 italic max-w-4xl text-sm sm:text-base">
							Victoires, smashs, séries et records obtenus, tout ce que tu as obtenu
							au fil des services en salle est là.
						</p>
					</header>
					<FetchStats />
				</div>
			</div>
		</QueryClientProvider>
	</>
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';


// Utilisé pour fetch depuis le back,
// oui c'est encore un autre plug-in...
const queryClient = new QueryClient()

const SectionTitle = ({ children }) => (
	<h2 className="
			pt-10
			pb-6
			font-caprasimo
			tracking-wide

			text-shadow-amber-200
			text-shadow-2xs

			text-center
			text-5xl
			">
			=\=\=\=\=\ {children} /=/=/=/=/=
			</h2>
)


const StatCard = ({ label, value }) => (
	<div className="
			bg-amber-50				//fond beige
			border-2				//bordure 2px d'epaisseur
			border-amber-900/40		//opacité 40%
			rounded-lg 				//coins arrondis
			p-4						//padding interieur (espacement entre le contenu et sa bordure)

			shadow-md				//ombre moyenne au repos
			hover:shadow-lg			//ombre plus grande au survol
			hover:-translate-y-1	//soulevement de 4px
			transition-all			//anime tout les changements
			duration-150			//duree de l'animation 150ms
			
			flex flex-col			//empilement vertical des blocs StatCard
			justify-center			//centrage des card
			min-h-32">

		<div className="
			text-4xl				//taille
			text-center				//centrage
			font-caprasimo			//police custom
			text-black				//couleur du texte
			">
			{value}
		</div>
		<div className="
			text-sm					//taille
			text-center				//centre
			text-amber-900/80		//couleur brune 80%
			font-medium				//gras
			mt-2					//marge haute
			uppercase				//majuscule
			tracking-wider			//espace des lettres
			">
			{label}
		</div>
	</div>
)

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
					Navigate('/login')
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
		<h2 className="text-center pb-4 font-caprasimo text-8xl">
			Chef {data.username}
		</h2>
		<p className="text-center pb-6 italic text-amber-900/70">
			Voici le récapitulatif de ta carrière en cuisine
		</p>
		
		{/* ===== PARTIES ===== */}
		<SectionTitle>GAMES</SectionTitle>
		<div className="grid grid-cols-4 gap-4">
			<StatCard label="Match played"	value={s.nb_games}/>
			<StatCard label="Victories"		value={s.nb_victories}/>
			<StatCard label="Defeats"		value={s.nb_defeats}/>
			<StatCard label="Ratio V/D"		value={`${calcWinRate}%`}/>
		</div>

		{/* ===== RECORDS ===== */}
		<SectionTitle>RECORDS</SectionTitle>
		<div className="grid grid-cols-3 gap-4">
			<StatCard label="Rang actuel"         value={s.rank} />
			<StatCard label="Meilleur rang"       value={s.rank_max} />
			<StatCard label="Heures de jeu"       value={s.hours_played} />
			<StatCard label="Série de victoires"  value={s.max_win_streak} />
			<StatCard label="Série de défaites"   value={s.max_loose_streak} />
			<StatCard label="Smashs consécutifs"  value={s.max_smash_success_streak} />
		</div>

		{/* ===== SMASH ===== */}
		<SectionTitle>SMASH</SectionTitle>
		<div className="grid grid-cols-3 gap-4">
			<StatCard label="Nombre de smashs"  value={s.nb_smash} />
			<StatCard label="Smashs réussis"    value={s.nb_smash_success} />
			<StatCard label="Précision"         value={`${smashAccuracy}%`} />
			<StatCard label="Réaction moyenne"  value={`${s.avg_reaction_ms} ms`} />
			<StatCard label="Meilleur combo"    value={changeNone(s.most_combo_smash)} />
			<StatCard label="Carte smashée"     value={changeNone(s.most_smashed_card)} />
		</div>

		{/* ===== DIVERS ===== */}
		<SectionTitle>DIVERS</SectionTitle>
		<div className="grid grid-cols-2 gap-4">
			<StatCard label="Carte favorite"  value={changeNone(s.favorite_card)} />
			<StatCard label="Bonus joués"     value={s.nb_bonus_played} />
		</div>
	</div>
}

export function Statistics () {
	const navigate = useNavigate()
	return <>
		<QueryClientProvider client={queryClient}>
			{/*wrappeur exterieur - prend tout l'ecran et donne le fond
				inset-0 pour recouvrir tout l'ecran
				min-h-full permet le scroll vertical car affichage à 100%
				bg-amber-50 couleur du fond
				overflow-y-auto active le scroll vertical
				*/}
			<div className="inset-0 min-h-full bg-amber-50 overflow-y-auto">
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
									transition-colors">
						<span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
						<span className="text-xs uppercase tracking-[0.3em] font-bold">Retour en cuisine</span>
					</button>
					<FetchStats />
				</div>
			</div>
		</QueryClientProvider>
	</>
}

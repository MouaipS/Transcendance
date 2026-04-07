import { useNavigate } from "react-router-dom";


export function Rules () {

	const navigate = useNavigate()

	const navigateHome = () => {
		navigate("/home")
	}

	

	return <>
	<div className="absolute flex flex-col left-60 right-60 min-h-full px-6 py-12 lg:px-8 border-l-1 border-r-1 bg-amber-100">
		<div className="relative sm:mx-auto sm:w-full sm:max-w-sm">
			<h1 className="font-serif italic mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">. . . . . . . . . . RÈGLES DU JEU . . . . . . . . . .</h1>
		</div>
	
	<button onClick={navigateHome}>Home</button>
	<ul/>

	<div className="mt-8 mb-8">
		<h2 className="font-serif text-center text-2xl">Bienvenus jeunes commis !</h2>
	</div>

	<div className="mb-8">
	<p className="font-serif text-xl text-center">
		"Nom du jeu" est un jeu de cartes dans lequel vous incarnez des cuisiniers et 
		cuisinières en plein rush. Vous devez récupérer des ingrédients et confectionner 
		des plats pour marquer le plus de points possible. Mais en cuisine, le rythme est 
		soutenu ! Seuls les plus rapides pourront accéder au rang tant convoité de Grand Chef.
	</p>
	</div>

	<div className="mb-8">
		<h2 className="font-serif text-xl text-center">BUT DU JEU</h2>
	</div>

	<div className="mb-8">
	<p className="text-center">
		Les joueurs s'affrontent au cours de plis qu'ils doivent remporter pour marquer
		des points. À la fin du temps imparti, la personne ayant marqué le plus de 
		points est déclarée vainqueur.
	</p>
	</div>

	<div className="mb-5">
		<h2 className="font-serif text-xl text-center">MATÉRIEL</h2>
	</div>

	<div className="mb-5">
		<h1 className="text-center font-bold">. . . Le jeu se compose de 3 types de cartes . . .</h1>
	</div>

	<div className="flex flex-row mb-8">
		<div className="basis-1/3">
			<p className="text-center">Les cartes Ingrédients</p>
			<img
				alt="logo"
				src="src/components/images/carte.png"
				className="mx-auto h-35 w-auto"
			/>
		</div>
		<div className="basis-1/3">
			<p className="text-center">Les cartes Ingrédients Périmés</p>
			<img
				alt="logo"
				src="src/components/images/carte.png"
				className="mx-auto h-35 w-auto"
			/>
		</div>
		<div className="basis-1/3">
			<p className="text-center">Les cartes Récipients</p>
			<img
				alt="logo"
				src="src/components/images/carte.png"
				className="mx-auto h-35 w-auto"
			/>
		</div>
	</div>
	<p>
		Chaque joueur commence la partie avec un paquet identique de cartes, 
		mélangé aléatoirement.
	</p>
	<h2>DÉROULEMENT D'UN PLI</h2>
	<p>
		Tour à tour, les joueurs vont retourner la première carte de leur deck au centre 
		de la zone de jeu, et ce jusqu'à ce que l'un d'entre eux remporte le pli. 
		Il existe trois manières de remporter un pli :
	</p>
	<h3>1. Remplir son récipient</h3>
	<p>
		Lorsqu'un joueur (A) retourne une carte Récipient, il oblige le joueur suivant 
		à devenir son commis. Le commis doit maintenant "remplir" le Récipient du joueur 
		A en tirant autant de cartes que nécessaire. Le nombre de cartes que le commis  
		doit tirer pour remplir le Récipient du joueur A depend du type de Récipient :
	</p>
	<ul>
			<li>La Cuillère : le commis doit tirer une carte</li>
    		<li>L'Assiette : le commis doit tirer deux cartes</li>
    		<li>Le Plat à Gratin : le commis doit tirer trois cartes</li>
			<li>La Grosse Marmite : le commis doit tirer quatre cartes</li>
	</ul>
	<p>
		Si toutes les cartes tirées par le commis sont des cartes Ingrédients, il 
		remplit entièrement le récipient du joueur A et lui fait gagner le pli. 
		Le joueur A récupère alors toutes les cartes au centre de la zone de jeu et 
		un nouveau pli commence. Mais si l'une des cartes tirées par le commis est 
		une carte Récipient, alors il cesse immédiatement de tirer des cartes. 
		C'est maintenant au tour du joueur suivant de devenir commis et de tirer des 
		cartes pour remplir ce nouveau Récipient. On continue de cette facon, jusqu'à 
		ce qu'un joueur réussisse à faire remplir son Récipient entièrement par son 
		commis et remporte le pli.
	</p>
	<p>
		Exemple : Le joueur A tire une carte Assiette. Le joueur suivant, B, devient 
		alors son commis et doit remplir ce Recipient avec deux Ingrédients. 
		Le joueur B tire d'abord une carte Poivron (Ingrédient), puis une carte 
		Cuillère (Récipient à 1 Ingrédient). Il prend alors l'avantage, et oblige 
		maintenant le joueur suivant, C, à devenir son commis. Le joueur C tire une 
		carte Carotte (Ingredient), et atteint le nombre d'Ingrédients requis pour 
		remplir la Cuillère. Le joueur B gagne alors le pli et récupère toutes les 
		cartes situées au centre de la zone de jeu, qu'il place en dessous de son deck.
	</p>
	<h3>2. Smasher des ingredients : taper du poing sur la table !</h3>
	<p>
		À tout moment du pli, lorsque les conditions sont remplies, tous les joueurs 
		ont l'occasion de smasher, c'est-à-dire être le premier joueur à frapper le 
		centre de la zone de jeu en appuyant sur la touche Entrée.
	</p>
	<p>
		Les conditions requises pour pouvoir smasher des ingrédients sont les suivantes :
	</p>
	<ul>
			<li>
				DOUBLE : dès que deux cartes identiques sont tirées l'une apres 
				l'autre. Exemple : le joueur A tire une carte Carotte. Le joueur B 
				tire une carte Carotte. DOUBLE !!! Le premier joueur qui smashe 
				remporte le pli.
			</li>
    		<li>
				SANDWICH : dès qu'une carte est en situation dite de Sandwich : 
				prise entre deux cartes identiques. Exemple : Le joueur A tire une 
				carte Carotte. Le joueur B tire une carte Oignon. Le joueur C tire 
				une carte Carotte. SANDWICH !!! Le premier joueur qui smashe remporte 
				le pli.
			</li>
	</ul>
	<p>
		_NB : Toute action de smash effectuée alors que les conditions ne sont pas 
		remplies est considérée comme une faute. Le cuisinier qui en est responsable 
		subit immédiatement un malus de "N" points et perd "N" cartes de son deck, 
		qui sont placées immédiatement sous les cartes situées au centre de la zone 
		de jeu.
	</p>
	<p>
		_NB2 : Si personne ne smashe avant que le joueur suivant retourne une nouvelle 
		carte, les conditions pour smasher ne sont plus remplies et le jeu reprend 
		normalement.
	</p>
	<h3>3. Réaliser une Recette : chaud devant !</h3>
	<p>
		A tout moment du pli, les joueurs ont également la possiblité de smasher pour 
		réaliser une Recette, c'est-à-dire lorsque chacun des Ingrédients qui composent 
		l'une des Recettes du jeu sont tirés les uns à la suite des autres. La liste 
		détaillée des Recettes disponibles pendant cette partie, et les Ingrédients qui 
		les composent sont indiqués dans le menu situé à gauche de la zone de jeu.
	</p>
	<p>
		Exemple : La Recette Poulet Basquaise, actuellement au menu, est composée de 3 
		ingrédients : une carte Poulet, une carte Poivron, et une carte Oignon. Si ces 3 
		cartes Ingrédients sont tirées l'une après l'autre, dans n'importe quel ordre, 
		il y a RECETTE !!! Le premier joueur qui smashe réalise la recette Poulet 
		Basquaise et remporte le pli.
	</p>
	<p>
		NB : le Pouvoir des Recettes (à faire)
	</p>
	<p>
		Si elle est smashée avec une rapidité suffisante, chaque recette peut 
		déclencher un effet intéressant pour le cuisinier qui la réalise. Le pouvoir 
		associé à chaque recette est indiqué dans le menu situé à gauche de la zone de jeu.
	</p>
	<p>
		NB 2 : Attention aux ingrédients périmés ! (à faire)
	</p>
	<button onClick={navigateHome}>Home</button>
	</div>
	</>
}

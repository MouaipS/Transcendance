import { PlayerUI } from "./PlayerUI";

export function GameBoard ({ gameState }) {

	const { players = [], decks = [], timer = 0 } = gameState || {};

	return <>
	<div className="flex flex-col">

    <div className="px-5">
      <p className="py-5 absolute text-2xl font-semibold">{gameState.code}</p>

      <p className="px-10 py-20">{gameState.timer}</p>

      {gameState.owner && <button 
        className="bg-stone-900 py-4 px-12 text-amber-50 font-caprasimo text-3xl"
        onClick={gameState.Start}>Start</button>}
    </div>

    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
      <PlayerUI players={gameState.players[0]}
                decks={gameState.decks[0]}
                score={gameState.score[0]}
                player={gameState.player}
                index={0}
      />
    </div>

    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
      <PlayerUI players={gameState.players[3]}
                decks={gameState.decks[3]}
                score={gameState.score[3]}
                player={gameState.player}
                index={3}
      />
    </div>
        
    {!gameState.end && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-44 h-44 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-400">
        {/* <img
          src={gameState.cards[0]}
          className="h-80 rotate-50"
        />

        <img
          src={gameState.cards[1]}
          className="h-80 rotate-20 absolute px-140"
        /> */}

        <img
          src={gameState.cards[2]}
          style={{ transform: `rotate(${gameState.angle}deg)` }}
        />
        <p className="text-black">{gameState.discard}</p>
      </div>
    </div>}


    {gameState.end && <div className="flex flex-col items-center justify-center absolute inset-0 z-50">
    {<p className="mb-10 text-4xl text-center font-bold">{gameState.winner.toUpperCase()} A GAGNÉ !!!</p>}
    <button 
            className="bg-amber-300 px-8 py-6 text-stone-900 font-caprasimo text-3xl uppercase tracking-[0.2em] 
                border-2 border-stone-900 shadow-[4px_4px_0_0_rgba(28,25,23,1)] hover:bg-amber-400 hover:-translate-y-1 
                hover:shadow-[6px_6px_0_0_rgba(28,25,23,1)] active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(28,25,23,1)]
                transition-all"
            onClick={gameState.Replay}>Rejouer</button>
    </div>}

    {gameState.fail && <p className="absolute px-120 py-30 text-3xl">{gameState.smasher.toUpperCase()} A SMASH !!! EPIC FAIL BRUH ! </p>}
    {gameState.success && <p className="absolute px-120 py-30 text-3xl">{gameState.smasher.toUpperCase()} A SMASH !!! EPIC WIN WOW ! </p>}

    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
      <PlayerUI players={gameState.players[1]}
                decks={gameState.decks[1]}
                score={gameState.score[1]}
                player={gameState.player}
                index={1}
      />
    </div>

    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
      <PlayerUI players={gameState.players[2]}
                decks={gameState.decks[2]}
                score={gameState.score[2]}
                player={gameState.player}
                index={2}
      />
    </div>

  </div>
	</>
}
import { useEffect } from "react";

export const useGameSocket = (socketRef, config) => {
	const {
		code, username, cards, deck,
		setPlayers, setDecks, setScore, setTimer, 
		setDiscard, setPlayer, setPage, setSmasher, 
		setFail, setSuccess, setWinner, setEnd
	} = config

	const connect = () => {
		const socket = new WebSocket(`ws/game/${code}`);

		socket.onopen = () => {
			socket.send(JSON.stringify({ type: 'JOIN', data: username }))
		}

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data)
			console.log(data)

			switch (data.type) {
				case 'JOIN':
					setPlayers(data.users)
					break

				case 'DRAW':
					setSuccess(false)
					setFail(false)
					updatePlayerState(data)
					handleCardsDisplay(data)
					break

				case 'TIME':
					setTimer(data.time)
					break

				case 'FAIL':
					setFail(true)
					updatePlayerState(data)
					setSmasher(data.player.username)
					break

				case 'SUCCESS':
					setSuccess(true)
					updatePlayerState(data)
					setSmasher(data.player.username)
					while (cards.length > 0) cards.shift()
					break

				case 'WINNER':
					setSuccess(false)
					setFail(false)
					while (cards.length > 0) cards.shift()
					setWinner(data.winner.username)
					setEnd(true)
					break

				default:
					break
			}
		}

		
		const updatePlayerState = (data) => {
			setDecks((prev) => {
				const next = [...prev]
				next[data.player.id] = data.player.deck.length
				return next
			})
			setScore((prev) => {
				const next = [...prev]
				next[data.player.id] = data.player.score
				return next
			})
			setDiscard(data.discard_value)
			setPlayer(data.player.id)
		}

		const handleCardsDisplay = (data) => {
			if (cards.length === 3) cards.shift()
			if (cards.length === 0) {
				cards.push("")
				cards.push("")
			}
			const idx = deck.findIndex(d => d.name === data.player.card.name)
			if (idx !== -1) cards.push(deck[idx].src)
		}

		socketRef.current = socket
		setPage(1)
	}

	return { connect }
}
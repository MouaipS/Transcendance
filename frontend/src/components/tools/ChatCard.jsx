import {useState, useEffect, useRef} from "react"
import {useQuery} from '@tanstack/react-query'

export function ChatCard() {

	
	const [activeFriend, setActiveFriend] = useState(null)
	const [messagesByFriend, setMessagesByFriend] = useState({})
	const socketRef = useRef(null)
	const [draft, setDraft] = useState('')
	const messageEndRef = useRef(null)
	const [isConnected, setIsConnected] = useState(false)
	const inputRef = useRef(null)

	const {data: homeData } = useQuery({
		queryKey: ['home'],
		queryFn: () => fetch('/api/home', {credentials: 'include'})
			.then(res => res.json())
	})

	const currentUserId = homeData?.id ?? null

	//recuperer la liste des amis
	const {data: friendsData, isLoading, error } = useQuery ({
		queryKey: ['friends'],
		queryFn: () => fetch('/api/friends', {credentials : 'include'})
			.then(res => res.json())
	})

	const friends = friendsData?.friends ?? []

	//connexion WebSocket persistante
	useEffect(() => {
		if (!currentUserId) return

		//creation du websok
		const socket = new WebSocket(`wss://${window.location.host}/ws/chat`)
		socketRef.current = socket

		//si tout va bien
		socket.onopen = () => {
			setIsConnected(true) 
			console.log('[DMSocket] connecté')
		}

		//declenché en cas de message
		socket.onmessage = (event) => {
			const data = JSON.parse(event.data)
			if(data.type !== 'DM') return

            console.log('[DMSocket] Message reçu :', data)

			const otherId = data.sender_id === currentUserId ? data.receiver_id : data.sender_id

			//update et ajout du message
			setMessagesByFriend(prev => ({
				...prev, [otherId]: [...(prev[otherId] ?? []), data],
			}))
		}

		socket.onerror = (err) => console.error('[DMSocket] Erreur :', err)
		socket.onclose = (e) => {
			setIsConnected(false)    
			console.log('[DMSocket] Fermé', e.code, e.reason)
		}

		return () => socket.close()

	}, [currentUserId])

	//chargement de l'historique HTTP
	useEffect(() => {
		if (!activeFriend) return

		if(messagesByFriend[activeFriend.user_id]) return

		fetch(`/api/chat/${activeFriend.user_id}`, {credentials: 'include'})
			.then(res => res.json())
			.then(data => {
				setMessagesByFriend(prev => ({
					...prev,
					[activeFriend.user_id]: data.messages ?? [],
				}))
			})
	}, [activeFriend])

	//auto scroll vers le dernier obj
	useEffect(() => {
		messageEndRef.current?.scrollIntoView({behavior: 'smooth'})
	}, [activeFriend ? messagesByFriend[activeFriend.user_id]?.length : 0])


	useEffect(() => {
        if (activeFriend && isConnected) {
            inputRef.current?.focus()
        }
    }, [activeFriend, isConnected])

	//pour envoyer le message
	const sendMessage = () => {
		const content = draft.trim()
		if(!content || !activeFriend) return
		if(!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return

		socketRef.current.send(JSON.stringify({
			type: 'DM',
			to: activeFriend.user_id,
			content,
		}))
		setDraft('')
	}

	if(!activeFriend) {

		if (isLoading)
            return <div className="text-amber-200/70 italic">Chargement...</div>
        if (error)
            return <div className="text-red-400 italic">Erreur de chargement</div>
        if (friends.length === 0) {
			return (
                <div className="flex flex-col items-center text-center justify-center h-full min-h-32 gap-2">
                    <p className="text-base text-amber-300">
                        Pas encore de contacts dans ton carnet, chef !
                    </p>
                </div>
            )
        }


		return (
			<div className="flex flex-col gap-2">
				<p className="text-amber-300 text-xs uppercase tracking-[0.2em] mb-1">
					Tes contacts
				</p>
				{friends.map(f => (
					<button
						key={f.user_id}
						onClick={() => setActiveFriend(f)}
						className="flex items-center gap-3 border-2 border-stone-900 bg-amber-50 px-3 py-2
							hover:bg-amber-100 hover:-translate-y-0.5 transition-all">
						<span className="font-caprasimo text-lg text-stone-900">
							{f.username}
						</span>
						<span className="ml-auto text-stone-700 font-bold">→</span>
					</button>
				))}
			</div>
		)
	}

	const activeMessage = messagesByFriend[activeFriend.user_id] ?? []

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => setActiveFriend(null)}
                    className="text-amber-300 text-sm font-bold hover:text-amber-200">
                    ← {activeFriend.username}
                </button>
                <span
                    title={isConnected ? "Connecté" : "Déconnecté"}
                    className={`h-2 w-2 rounded-full border border-stone-900
                        ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-1 mt-1">
                {activeMessage.length === 0 ? (
                    <p className="text-amber-200/70 italic text-sm">
                        Aucun message. Lance la discussion !
                    </p>
                ) : (
                    activeMessage.map(m => {
                        const mine = m.sender_id === currentUserId
                        return (
                            <div
                                key={m.id}
                                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-2 py-1 border-2 border-stone-900 text-sm
                                    ${mine ? 'bg-amber-300' : 'bg-amber-50'}`}>
                                    <span className="text-stone-900">{m.content}</span>
                                </div>
                            </div>
                        )
                    })
                )}
				<div ref={messageEndRef} />
            </div>
            <div className="flex gap-1 mt-2 pt-2 border-t border-amber-300/30">
                <input
					ref={inputRef}
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={isConnected ? "Ton message..." : "Connexion en cours..."}
                    disabled={!isConnected}                                          // ◄── ajout
                    maxLength={1000}
                    className="flex-1 px-2 py-1 bg-amber-50 border-2 border-stone-900 text-xs text-stone-900
                        focus:outline-none focus:bg-white disabled:opacity-50"
                />
                <button
                    onClick={sendMessage}
                    disabled={!draft.trim() || !isConnected}                         // ◄── modifié
                    className="px-2 py-1 border-2 border-stone-900 bg-amber-300 text-stone-900
                        text-[10px] font-bold uppercase tracking-[0.2em]
                        hover:bg-amber-200 disabled:opacity-40">
                    Envoi
                </button>
            </div>
        </div>
    )
}
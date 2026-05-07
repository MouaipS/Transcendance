import {useState} from "react"
import {useQuery} from '@tanstack/react-query'

export function ChatCard() {

	const [activeFriend, setActiveFriend] = useState(null)

	const {data: homeData } = useQuery({
		queryKey: ['home'],
		queryFn: () => fetch('/api/home', {credentials: 'include'})
			.then(res => res.json())
	})

	const currentUserId = homeData?.id ?? null

	const {data: friendsData, isLoading, error } = useQuery ({
		queryKey: ['friends'],
		queryFn: () => fetch('/api/friends', {credentials : 'include'})
			.then(res => res.json())
	})

	const friends = friendsData?.friends ?? []

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
			<div className="flex flex-col gap-1">
				<p className="text-amber-300 text-xs uppercase tracking-[0.2em] mb-2">
					Tes contacts
				</p>
				<p className="text-amber-200/70 italic text-sm">
				(Bientot la liste)</p>
			</div>
		)
	}
	return (
		<div className="flex flex-col h-full">
			<button
				onClick={() => setActiveFriend(null)}
				className="text-amber-300 text-sm font-bold mb-2 self-start hover:text-amber-200">
					← {activeFriend.username}
			</button>
			<p className="text-amber-200/70 italic text-sm">
				(Bientot les messages)
			</p>
		</div>
	)
}
import {useState, useEffect, useRef } from "react"
import {useQuery, useQueryClient } from "@tanstack/react-query"

export function DMChat({ currentUserId}) {

	return (
		<div className="flex flex-col h-full border-2 border-stone-900 bg-amber-50/60">
			<div className="border-b-2 border-stone-900 px-4 py-3">
				<div className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-700">
				Salon de discussion
			</div>
			<h3 className="font-caprasimo text-2xl text-stone-900 leading-none mt-1">
				Messages
			</h3>
		</div>
			<div className="flex-1 p-4 text-stone-700 italic text-sm">
				Liste des amis
				<br/>
				<br/>
				<span className="text-xs">currentUserId reçu : {currentUserId ?? 'pas def'</span>
			</div>
		</div>
	)
}
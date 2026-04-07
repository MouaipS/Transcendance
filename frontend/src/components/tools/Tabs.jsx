import { useState } from "react"
import { tabsData } from "../data/tabs.jsx"
import { useNavigate } from "react-router-dom"


export default function tabs () {
	
	const [selectedTab, setSelectedTab] = useState(0)
	const navigate = useNavigate()

	const navigateTabs = () => {
		navigate(tabsData[selectedTab].url)
	}
	
	return	<div className="max-w-[350px] min-h-[250px] rounded border border-slate-400 mt-4">
		<div className="flex divide-x divide-slate-700">
			{tabsData.map((obj, index) => (
				<button 
					className="w-full p-4 font-medium bg-slate-200 hover:bg-slate-300"
					key={index} 
					onClick={() => setSelectedTab(index)}
					>
					{tabsData[index].tabTitle }
				</button>
			))}
		</div>
		<div className="px-6 pt-6 pb-10">
			<p className="text-2xl font-semibold mb-2">
				{tabsData[selectedTab].tabHeading}
			</p>
			<div>
				{tabsData[selectedTab].txt}
			</div>
			<button 
				className="mt-10 flex justify-center rounded-md
				bg-blue-400 px-3 py-1.5 text-sm/6 font-semibold
				hover:bg-blue-300 focus-visible:outline-2 
				focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
				border border-black shadow-md hover:shadow-none 
				hover:inset-shadow-xs hover:inset-shadow-black/50"
				onClick={navigateTabs}
				>
				Voir plus
			</button>
		</div>
	</div>
}
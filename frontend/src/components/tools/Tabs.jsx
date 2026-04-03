import { useState } from "react"
import { tabsData } from "../data/tabs.jsx"
import { useNavigate } from "react-router-dom"


export default function tabs () {
	
	const [selectedTab, setSelectedTab] = useState(0)
	const navigate = useNavigate()

	const navigateTabs = () => {
		navigate(tabsData[selectedTab].url)
	}
	
	return	<div>
		<div>
			{tabsData.map((obj, index) => (
				<button key={index} onClick={() => setSelectedTab(index)}>
					{tabsData[index].tabTitle }
				</button>
			))}
		</div>
		<div>
			<p>
				{tabsData[selectedTab].tabHeading}
			</p>
			<div>
				{tabsData[selectedTab].txt}
			</div>
			<ul/>
			<button onClick={navigateTabs}>Voir plus</button>
		</div>
	</div>
}
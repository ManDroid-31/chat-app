// import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
function Home() {

	return (
		<>
			<div className="fixed inset-0 bg-gray-100 flex">
				
				
				<Sidebar />

				{/* Main Chat Area */}
				<ChatContainer />
			</div>


		</>
	)
}

export default Home

"use client";

import SideBar from "@/components/home/SideBar";

export default function HomeLayout({ children }) {
	return (
		<div className='flex min-h-screen bg-white text-gray-900'>
			{/* Sidebar - Clean white with subtle border */}
			<aside className='w-64 bg-white shadow-professional border-r border-gray-200'>
				<SideBar />
			</aside>

			{/* Main content area */}
			<div className='flex-1 flex flex-col'>
				{/* Header - Clean white with professional styling */}
				<header className='flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200 shadow-professional'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900 tracking-tight'>
							NeuroWell
						</h1>
						<p className='text-sm text-gray-600 mt-1'>
							Your personal wellness companion for mental health tracking
						</p>
					</div>

					<div className='flex items-center gap-4'>
						<input
							type='text'
							placeholder='Search insights...'
							className='px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm'
						/>
						<div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-professional'>
							U
						</div>
					</div>
				</header>

				{/* Main content - Clean white background */}
				<main className='flex-1 p-8 overflow-y-auto bg-gray-50'>
					{children}
				</main>

				{/* Footer - Minimal white footer */}
				<footer className='py-4 text-center text-sm text-gray-500 border-t border-gray-200 bg-white'>
					© {new Date().getFullYear()} NeuroWell. All rights reserved.
				</footer>
			</div>
		</div>
	);
}

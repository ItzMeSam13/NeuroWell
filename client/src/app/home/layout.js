"use client";

import SideBar from "@/components/home/SideBar";

export default function HomeLayout({ children }) {
	return (
		<div className='flex min-h-screen bg-white text-gray-900'>
			{/* Sidebar - Soft blue-gray */}
			<aside className='w-64 bg-slate-50 shadow-sm border-r border-slate-200'>
				<SideBar />
			</aside>

			{/* Main content area */}
			<div className='flex-1 flex flex-col'>
				{/* Header - Light teal tint */}
				<header className='flex items-center justify-between px-8 py-6 bg-teal-50/30 border-b border-gray-200'>
					<div>
						<h1 className='text-3xl font-semibold text-gray-800'>
							MindTrack AI
						</h1>
						<p className='text-sm text-gray-500'>
							Your personal AI companion for early mental wellness detection 💚
						</p>
					</div>

					<div className='flex items-center gap-3'>
						<input
							type='text'
							placeholder='Search insights...'
							className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white'
						/>
						<div className='w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold'>
							U
						</div>
					</div>
				</header>

				{/* Main - Pure white */}
				<main className='flex-1 p-8 overflow-y-auto bg-white'>{children}</main>

				{/* Footer - Light warm gray */}
				<footer className='py-4 text-center text-sm text-gray-500 border-t border-gray-200 bg-gray-50/50'>
					© {new Date().getFullYear()} MindTrack AI. All rights reserved.
				</footer>
			</div>
		</div>
	);
}

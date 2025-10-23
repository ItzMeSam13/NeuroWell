"use client";

import { signout } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function NavigationBar() {
	const router = useRouter();

	const handleSignout = async () => {
		try {
			await signout();
			router.push("/auth");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<nav className='flex justify-between items-center p-6 bg-white border-b border-gray-200 shadow-professional'>
			<div className='flex items-center gap-3'>
				<div className='p-2 bg-blue-50 rounded-lg'>
					<User className='w-5 h-5 text-blue-600' />
				</div>
				<h1
					className='text-2xl font-bold cursor-pointer text-gray-900 hover:text-blue-600 transition-colors'
					onClick={() => router.push("/home")}>
					NeuroWell
				</h1>
			</div>

			<button
				onClick={handleSignout}
				className='flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200 font-medium shadow-sm'>
				<LogOut className='w-4 h-4' />
				Log Out
			</button>
		</nav>
	);
}

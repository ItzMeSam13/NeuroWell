"use client";

import { signout } from "@/app/lib/auth";
import { useRouter } from "next/navigation";

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
		<nav className='flex justify-between items-center p-4 border-b'>
			<h1
				className='text-xl font-semibold cursor-pointer text-black'
				onClick={() => router.push("/home")}>
				MyApp
			</h1>
			<button
				onClick={handleSignout}
				className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
				Log Out
			</button>
		</nav>
	);
}

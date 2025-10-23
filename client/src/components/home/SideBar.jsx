"use client";

import { usePathname, useRouter } from "next/navigation";
import { signout } from "@/app/lib/auth";
import { Home, User, LogOut } from "lucide-react";

export default function SideBar() {
	const router = useRouter();
	const pathname = usePathname();

	const topItem = { name: "Dashboard", path: "/home", icon: Home };
	const bottomItems = [
		{ name: "Profile", path: "/home/profile", icon: User },
		{ name: "Logout", action: "logout", icon: LogOut },
	];

	const handleClick = async (item) => {
		if (item.action === "logout") {
			await signout();
			router.push("/auth");
		} else {
			router.push(item.path);
		}
	};

	const isActive = pathname === topItem.path;

	return (
		<div className='h-full flex flex-col justify-between p-6'>
			{/* App branding */}
			<div>
				<div className='mb-8'>
					<h2 className='text-xl font-bold text-gray-900 tracking-tight'>
						NeuroWell
					</h2>
					<p className='text-xs text-gray-500 mt-1'>Wellness Tracker</p>
				</div>

				{/* Navigation items */}
				<nav className='space-y-1'>
					<div
						onClick={() => handleClick(topItem)}
						className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
							isActive
								? "bg-blue-50 text-blue-700 border border-blue-200"
								: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
						}`}>
						<topItem.icon className='w-4 h-4' />
						{topItem.name}
					</div>
				</nav>
			</div>

			{/* Bottom actions */}
			<div className='space-y-1'>
				{bottomItems.map((item) => (
					<div
						key={item.name}
						onClick={() => handleClick(item)}
						className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
							item.action === "logout"
								? "text-red-600 hover:bg-red-50 hover:text-red-700"
								: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
						}`}>
						<item.icon className='w-4 h-4' />
						{item.name}
					</div>
				))}
			</div>
		</div>
	);
}

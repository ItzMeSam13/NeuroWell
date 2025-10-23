"use client";

import { usePathname, useRouter } from "next/navigation";
import { signout } from "@/app/lib/auth";

export default function SideBar() {
	const router = useRouter();
	const pathname = usePathname();

	const topItem = { name: "Home", path: "/home" };
	const bottomItems = [
		{ name: "Edit Profile", path: "/home/profile" },
		{ name: "Logout", action: "logout" },
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
		<div className='h-full flex flex-col justify-between p-5'>
			{/* App name */}
			<div>
				<h2 className='text-2xl font-bold mb-8 text-black tracking-tight'>
					MyApp
				</h2>

				{/* Home */}
				<div
					onClick={() => handleClick(topItem)}
					className={`cursor-pointer px-4 py-2.5 mb-2 rounded-xl text-[15px] font-medium transition-all ${
						isActive
							? "bg-[#1de9b6]/90 text-white shadow-sm"
							: "text-gray-700 hover:bg-gray-100"
					}`}>
					{topItem.name}
				</div>
			</div>

			{/* Bottom actions */}
			<div className='space-y-2'>
				{bottomItems.map((item) => (
					<div
						key={item.name}
						onClick={() => handleClick(item)}
						className={`cursor-pointer px-4 py-2.5 rounded-xl text-[15px] font-medium transition-all ${
							item.action === "logout"
								? "text-red-500 hover:bg-red-50"
								: "text-gray-700 hover:bg-gray-100"
						}`}>
						{item.name}
					</div>
				))}
			</div>
		</div>
	);
}

	// app/home/page.js
	"use server";
	import DailyCheckIn from "@/components/home/daily_checkin";
	import { getUser } from "@/app/lib/getUser";
	export default async function HomePage() {
		const user = await getUser();
		return (
			<>
				<h1 className='text-4xl font-bold mb-8'>Welcome {user.email}!</h1>
				<p>User ID: {user.user_id}</p>
				<DailyCheckIn/>
			</>
		);
	}

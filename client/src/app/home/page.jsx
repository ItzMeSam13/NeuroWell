"use server";

import { getUserById } from "@/app/lib/User";
import DailyCheckIn from "@/components/home/daily_checkin";
import { getUser } from "@/app/lib/getUser";
import WellnessGraph from "@/components/home/Graphs";
import { getDailyData } from "@/app/lib/dailydata";
import Chatbot from "@/components/home/Chatbot";
import WellnessScore from "@/components/home/WellnessScore";

export default async function HomePage() {
	const user = await getUser();
	const UserData = await getUserById(user.user_id);
	const wellnessData = await getDailyData(user.user_id); // fetch last 7 days

	return (
		<div className='space-y-8'>
			{/* Welcome Section */}
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-8'>
				<div className='flex items-center gap-4 mb-4'>
					<div className='p-3 bg-blue-50 rounded-full'>
						<svg
							className='w-6 h-6 text-blue-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
							/>
						</svg>
					</div>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>Welcome back!</h1>
						<p className='text-gray-600 mt-1'>{user.email}</p>
					</div>
				</div>
				<p className='text-gray-500 text-sm'>
					Track your wellness journey and maintain your mental health
				</p>
			</div>

			{/* Main Dashboard Layout */}
			<div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
				{/* Left Column - Daily Check-in and Graph */}
				<div className='xl:col-span-2 space-y-8'>
					{/* Daily Check-in */}
					<div>
						<DailyCheckIn UserData={UserData} />
					</div>

					{/* Wellness Graph */}
					<div>
						<WellnessGraph wellnessData={wellnessData} />
					</div>
				</div>

				{/* Right Column - Chatbot and Wellness Score */}
				<div className='xl:col-span-1 space-y-6'>
					{/* AI Chatbot */}
					<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 overflow-hidden h-[500px]'>
						<Chatbot wellnessData={wellnessData} />
					</div>

					{/* Wellness Score */}
					<div>
						<WellnessScore wellnessData={wellnessData} />
					</div>
				</div>
			</div>
		</div>
	);
}

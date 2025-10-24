"use server";

import { getUserById } from "@/app/lib/User";
import { getUser } from "@/app/lib/getUser";
import { getDailyData } from "@/app/lib/dailydata";
import ActivitiesList from "@/components/home/ActivitiesList";

export default async function ActivitiesPage() {
	const user = await getUser();
	const UserData = await getUserById(user.user_id);
	const wellnessData = await getDailyData(user.user_id); // fetch last 7 days

	return (
		<div className='space-y-8'>
			{/* Header Section */}
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-8'>
				<div className='flex items-center gap-4 mb-4'>
					<div className='p-3 bg-green-50 rounded-full'>
						<svg
							className='w-8 h-8 text-green-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</div>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							Wellness Activities
						</h1>
						<p className='text-gray-600 mt-1'>
							Personalized activities to improve your mental health
						</p>
					</div>
				</div>
				<p className='text-gray-500 text-sm'>
					Based on your wellness data and profile, here are activities tailored
					just for you
				</p>
			</div>

			{/* Activities List */}
			<ActivitiesList userData={UserData} wellnessData={wellnessData} />
		</div>
	);
}

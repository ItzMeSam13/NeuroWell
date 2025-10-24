"use server";

import { getUserById } from "@/app/lib/User";
import { getUser } from "@/app/lib/getUser";
import { getDailyData } from "@/app/lib/dailydata";
import CounsellorsList from "@/components/home/CounsellorsList";
import { Users, Heart, Brain } from "lucide-react";

export default async function CounsellorsPage() {
	const user = await getUser();
	const UserData = await getUserById(user.user_id);
	const wellnessData = await getDailyData(user.user_id); // fetch last 7 days

	return (
		<div className='space-y-8'>
			{/* Header Section */}
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-8'>
				<div className='flex items-center gap-4 mb-4'>
					<div className='p-3 bg-purple-50 rounded-full'>
						<Users className='w-6 h-6 text-purple-600' />
					</div>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							Mental Health Counsellors
						</h1>
						<p className='text-gray-600 mt-1'>
							Find the right counsellor for your mental health journey
						</p>
					</div>
				</div>
				<p className='text-gray-500 text-sm'>
					Our AI-powered system analyzes your wellness data and profile to
					recommend the most suitable counsellors for your specific needs.
				</p>
			</div>

			{/* Features Section */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6'>
					<div className='flex items-center gap-3 mb-3'>
						<div className='p-2 bg-blue-50 rounded-lg'>
							<Brain className='w-5 h-5 text-blue-600' />
						</div>
						<h3 className='font-semibold text-gray-900'>AI Recommendations</h3>
					</div>
					<p className='text-gray-600 text-sm'>
						Get personalized counsellor recommendations based on your wellness
						data and mental health history.
					</p>
				</div>

				<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6'>
					<div className='flex items-center gap-3 mb-3'>
						<div className='p-2 bg-green-50 rounded-lg'>
							<Heart className='w-5 h-5 text-green-600' />
						</div>
						<h3 className='font-semibold text-gray-900'>Specialized Care</h3>
					</div>
					<p className='text-gray-600 text-sm'>
						Find counsellors specializing in anxiety, depression, trauma,
						relationships, and more.
					</p>
				</div>

				<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6'>
					<div className='flex items-center gap-3 mb-3'>
						<div className='p-2 bg-purple-50 rounded-lg'>
							<Users className='w-5 h-5 text-purple-600' />
						</div>
						<h3 className='font-semibold text-gray-900'>
							Verified Professionals
						</h3>
					</div>
					<p className='text-gray-600 text-sm'>
						All counsellors are licensed professionals with verified credentials
						and experience.
					</p>
				</div>
			</div>

			{/* Counsellors List */}
			<CounsellorsList userData={UserData} wellnessData={wellnessData} />
		</div>
	);
}

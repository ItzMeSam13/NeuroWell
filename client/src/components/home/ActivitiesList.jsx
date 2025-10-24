"use client";

import React, { useState, useEffect } from "react";
import {
	Brain,
	Heart,
	Moon,
	Activity,
	Clock,
	Star,
	CheckCircle,
	Lightbulb,
	Target,
	Zap,
} from "lucide-react";

export default function ActivitiesList({ userData, wellnessData }) {
	const [activities, setActivities] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [completedActivities, setCompletedActivities] = useState(new Set());

	useEffect(() => {
		if (userData && wellnessData) {
			fetchPersonalizedActivities();
		}
	}, [userData, wellnessData]);

	const fetchPersonalizedActivities = async () => {
		setIsLoading(true);
		try {
			// Calculate wellness score for context
			const avgMood =
				wellnessData.reduce((sum, day) => sum + (day.mood || 5), 0) /
				wellnessData.length;
			const avgStress =
				wellnessData.reduce((sum, day) => sum + (day.stress || 5), 0) /
				wellnessData.length;
			const avgSleep =
				wellnessData.reduce((sum, day) => sum + (day.sleep || 7), 0) /
				wellnessData.length;
			const avgProductivity =
				wellnessData.reduce((sum, day) => sum + (day.productivity || 5), 0) /
				wellnessData.length;

			const response = await fetch("http://localhost:5000/api/activities", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_profile: userData,
					wellness_data: {
						avg_mood: avgMood,
						avg_stress: avgStress,
						avg_sleep: avgSleep,
						avg_productivity: avgProductivity,
						recent_data: wellnessData,
					},
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setActivities(data.activities || []);
			} else {
				// Fallback to default activities if API fails
				setActivities(getDefaultActivities(userData, wellnessData));
			}
		} catch (error) {
			console.error("Error fetching activities:", error);
			// Fallback to default activities
			setActivities(getDefaultActivities(userData, wellnessData));
		} finally {
			setIsLoading(false);
		}
	};

	const getDefaultActivities = (userData, wellnessData) => {
		const activities = [];

		// Calculate user's current state
		const avgMood =
			wellnessData.reduce((sum, day) => sum + (day.mood || 5), 0) /
			wellnessData.length;
		const avgStress =
			wellnessData.reduce((sum, day) => sum + (day.stress || 5), 0) /
			wellnessData.length;
		const avgSleep =
			wellnessData.reduce((sum, day) => sum + (day.sleep || 7), 0) /
			wellnessData.length;

		// Mood-based activities
		if (avgMood < 5) {
			activities.push({
				id: "mood-boost-1",
				title: "Gratitude Journaling",
				description:
					"Write down 3 things you're grateful for today. This simple practice can significantly improve your mood.",
				category: "mindfulness",
				duration: "10-15 minutes",
				difficulty: "Easy",
				priority: "High",
				icon: "Brain",
				benefits: ["Improved mood", "Better perspective", "Reduced anxiety"],
			});
		}

		// Stress-based activities
		if (avgStress > 6) {
			activities.push({
				id: "stress-relief-1",
				title: "Deep Breathing Exercise",
				description:
					"Practice the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8.",
				category: "stress-relief",
				duration: "5-10 minutes",
				difficulty: "Easy",
				priority: "High",
				icon: "Heart",
				benefits: ["Reduced stress", "Lower heart rate", "Better focus"],
			});
		}

		// Sleep-based activities
		if (avgSleep < 6) {
			activities.push({
				id: "sleep-improvement-1",
				title: "Digital Sunset",
				description:
					"Turn off all screens 1 hour before bedtime and engage in calming activities.",
				category: "sleep",
				duration: "60 minutes",
				difficulty: "Medium",
				priority: "High",
				icon: "Moon",
				benefits: [
					"Better sleep quality",
					"Reduced blue light",
					"Improved melatonin",
				],
			});
		}

		// General wellness activities
		activities.push(
			{
				id: "general-1",
				title: "Mindful Walking",
				description:
					"Take a 15-minute walk while focusing on your surroundings and breathing.",
				category: "mindfulness",
				duration: "15 minutes",
				difficulty: "Easy",
				priority: "Medium",
				icon: "Activity",
				benefits: ["Physical activity", "Mental clarity", "Stress reduction"],
			},
			{
				id: "general-2",
				title: "Progressive Muscle Relaxation",
				description:
					"Tense and relax each muscle group from head to toe for complete relaxation.",
				category: "stress-relief",
				duration: "20 minutes",
				difficulty: "Medium",
				priority: "Medium",
				icon: "Heart",
				benefits: ["Muscle tension relief", "Better sleep", "Reduced anxiety"],
			}
		);

		return activities;
	};

	const categories = [
		{ id: "all", label: "All Activities", icon: Target },
		{ id: "mindfulness", label: "Mindfulness", icon: Brain },
		{ id: "stress-relief", label: "Stress Relief", icon: Heart },
		{ id: "sleep", label: "Sleep", icon: Moon },
		{ id: "physical", label: "Physical", icon: Activity },
	];

	const filteredActivities =
		selectedCategory === "all"
			? activities
			: activities.filter((activity) => activity.category === selectedCategory);

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "High":
				return "bg-red-100 text-red-700 border-red-200";
			case "Medium":
				return "bg-yellow-100 text-yellow-700 border-yellow-200";
			case "Low":
				return "bg-green-100 text-green-700 border-green-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case "Easy":
				return "text-green-600";
			case "Medium":
				return "text-yellow-600";
			case "Hard":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	const toggleActivityCompletion = (activityId) => {
		const newCompleted = new Set(completedActivities);
		if (newCompleted.has(activityId)) {
			newCompleted.delete(activityId);
		} else {
			newCompleted.add(activityId);
		}
		setCompletedActivities(newCompleted);
	};

	const getIconComponent = (iconName) => {
		const iconMap = {
			Brain: Brain,
			Heart: Heart,
			Moon: Moon,
			Activity: Activity,
		};
		return iconMap[iconName] || Activity; // Default to Activity if icon not found
	};

	// Handle activities that might not have icons
	const renderActivityIcon = (activity) => {
		if (!activity.icon) {
			return <Activity className='w-5 h-5 text-blue-600' />;
		}
		return React.createElement(getIconComponent(activity.icon), {
			className: "w-5 h-5 text-blue-600",
		});
	};

	if (isLoading) {
		return (
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-8'>
				<div className='flex items-center justify-center py-12'>
					<div className='text-center'>
						<div className='relative mb-4'>
							<div className='animate-spin rounded-full h-12 w-12 border-3 border-blue-200 border-t-blue-600 mx-auto'></div>
							<div className='absolute inset-0 flex items-center justify-center'>
								<Lightbulb className='w-5 h-5 text-blue-600 animate-pulse' />
							</div>
						</div>
						<p className='text-gray-600 font-medium'>
							Generating personalized activities...
						</p>
						<p className='text-sm text-gray-500 mt-1'>
							Analyzing your wellness data
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Category Filter */}
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					Filter Activities
				</h3>
				<div className='flex flex-wrap gap-3'>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => setSelectedCategory(category.id)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
								selectedCategory === category.id
									? "bg-blue-50 text-blue-700 border-blue-200"
									: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
							}`}>
							<category.icon className='w-4 h-4' />
							{category.label}
						</button>
					))}
				</div>
			</div>

			{/* Activities Grid */}
			{filteredActivities.length === 0 ? (
				<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-8 text-center'>
					<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Target className='w-8 h-8 text-gray-400' />
					</div>
					<h3 className='text-lg font-semibold text-gray-700 mb-2'>
						No Activities Found
					</h3>
					<p className='text-gray-500'>
						Try selecting a different category or check back later for new
						activities.
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
					{filteredActivities.map((activity) => (
						<div
							key={activity.id}
							className={`bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 ${
								completedActivities.has(activity.id) ? "opacity-75" : ""
							}`}>
							{/* Activity Header */}
							<div className='flex items-start justify-between mb-4'>
								<div className='flex items-center gap-3'>
									<div className='p-2 bg-blue-50 rounded-lg'>
										{renderActivityIcon(activity)}
									</div>
									<div>
										<h4 className='font-semibold text-gray-900'>
											{activity.title}
										</h4>
										<div className='flex items-center gap-2 mt-1'>
											<span
												className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
													activity.priority
												)}`}>
												{activity.priority} Priority
											</span>
										</div>
									</div>
								</div>
								<button
									onClick={() => toggleActivityCompletion(activity.id)}
									className={`p-2 rounded-lg transition-colors ${
										completedActivities.has(activity.id)
											? "bg-green-100 text-green-600"
											: "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
									}`}>
									<CheckCircle className='w-5 h-5' />
								</button>
							</div>

							{/* Activity Description */}
							<p className='text-gray-600 text-sm mb-4 leading-relaxed'>
								{activity.description}
							</p>

							{/* Activity Details */}
							<div className='space-y-3 mb-4'>
								<div className='flex items-center gap-2 text-sm text-gray-600'>
									<Clock className='w-4 h-4' />
									<span>{activity.duration}</span>
								</div>
								<div className='flex items-center gap-2 text-sm'>
									<Zap className='w-4 h-4 text-gray-400' />
									<span
										className={`font-medium ${getDifficultyColor(
											activity.difficulty
										)}`}>
										{activity.difficulty}
									</span>
								</div>
							</div>

							{/* Benefits */}
							<div>
								<h5 className='text-sm font-medium text-gray-700 mb-2'>
									Benefits:
								</h5>
								<div className='flex flex-wrap gap-1'>
									{activity.benefits.map((benefit, index) => (
										<span
											key={index}
											className='text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full'>
											{benefit}
										</span>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Completion Summary */}
			{completedActivities.size > 0 && (
				<div className='bg-green-50 border border-green-200 rounded-2xl p-6'>
					<div className='flex items-center gap-3 mb-2'>
						<Star className='w-5 h-5 text-green-600' />
						<h3 className='text-lg font-semibold text-green-800'>
							Great Progress!
						</h3>
					</div>
					<p className='text-green-700'>
						You've completed {completedActivities.size} activities. Keep up the
						excellent work!
					</p>
				</div>
			)}
		</div>
	);
}

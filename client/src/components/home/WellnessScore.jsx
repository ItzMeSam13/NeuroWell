"use client";

import { useState, useEffect } from "react";
import {
	TrendingUp,
	TrendingDown,
	Minus,
	Activity,
	Brain,
	Moon,
	Zap,
} from "lucide-react";

export default function WellnessScore({ wellnessData }) {
	const [analysis, setAnalysis] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (wellnessData && wellnessData.length > 0) {
			fetchWellnessAnalysis();
		}
	}, [wellnessData]);

	const fetchWellnessAnalysis = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				"http://localhost:5000/api/wellness-analysis",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						wellness_data: wellnessData,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				setAnalysis(data);
			} else {
				console.error("Failed to fetch wellness analysis");
			}
		} catch (error) {
			console.error("Error fetching wellness analysis:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const getScoreColor = (score) => {
		if (score >= 80) return "text-green-600";
		if (score >= 60) return "text-blue-600";
		if (score >= 40) return "text-yellow-600";
		return "text-red-600";
	};

	const getScoreBg = (score) => {
		if (score >= 80) return "bg-green-50 border-green-200";
		if (score >= 60) return "bg-blue-50 border-blue-200";
		if (score >= 40) return "bg-yellow-50 border-yellow-200";
		return "bg-red-50 border-red-200";
	};

	const getTrendIcon = (trend) => {
		if (trend === "improving")
			return <TrendingUp className='w-4 h-4 text-green-600' />;
		if (trend === "declining")
			return <TrendingDown className='w-4 h-4 text-red-600' />;
		return <Minus className='w-4 h-4 text-gray-600' />;
	};

	const getMetricIcon = (metric) => {
		switch (metric) {
			case "mood":
				return <Brain className='w-4 h-4' />;
			case "stress":
				return <Activity className='w-4 h-4' />;
			case "sleep":
				return <Moon className='w-4 h-4' />;
			case "productivity":
				return <Zap className='w-4 h-4' />;
			default:
				return <Activity className='w-4 h-4' />;
		}
	};

	if (isLoading) {
		return (
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6'>
				<div className='flex items-center justify-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
					<span className='ml-3 text-gray-600'>Analyzing wellness data...</span>
				</div>
			</div>
		);
	}

	if (!analysis) {
		return (
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6'>
				<div className='text-center text-gray-500'>
					<p>No wellness data available for analysis</p>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6'>
			{/* Header */}
			<div className='flex items-center gap-3 mb-6'>
				<div className='p-2 bg-blue-50 rounded-lg'>
					<Activity className='w-5 h-5 text-blue-600' />
				</div>
				<div>
					<h3 className='text-xl font-bold text-gray-900'>
						Weekly Wellness Score
					</h3>
					<p className='text-sm text-gray-600'>Based on your daily check-ins</p>
				</div>
			</div>

			{/* Overall Score */}
			<div
				className={`text-center p-6 rounded-xl border-2 ${getScoreBg(
					analysis.overall_score
				)} mb-6`}>
				<div className='text-4xl font-bold mb-2'>
					<span className={getScoreColor(analysis.overall_score)}>
						{analysis.overall_score}
					</span>
					<span className='text-gray-500 text-2xl'>/100</span>
				</div>
				<p className='text-lg font-semibold text-gray-700'>
					{analysis.overall_score >= 80
						? "Excellent"
						: analysis.overall_score >= 60
						? "Good"
						: analysis.overall_score >= 40
						? "Fair"
						: "Needs Attention"}
				</p>
			</div>

			{/* Score Breakdown */}
			<div className='space-y-4 mb-6'>
				<h4 className='font-semibold text-gray-900 mb-3'>Score Breakdown</h4>
				{Object.entries(analysis.score_breakdown).map(([metric, data]) => (
					<div
						key={metric}
						className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
						<div className='flex items-center gap-3'>
							{getMetricIcon(metric)}
							<div>
								<span className='font-medium text-gray-900 capitalize'>
									{metric}
								</span>
								<span className='text-sm text-gray-600 ml-2'>
									({data.average}/10)
								</span>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<span className={`font-bold ${getScoreColor(data.score)}`}>
								{data.score}
							</span>
							{analysis.trends[metric] && getTrendIcon(analysis.trends[metric])}
						</div>
					</div>
				))}
			</div>

			{/* Recommendations */}
			{analysis.recommendations && analysis.recommendations.length > 0 && (
				<div>
					<h4 className='font-semibold text-gray-900 mb-3'>Recommendations</h4>
					<div className='space-y-2'>
						{analysis.recommendations.map((rec, index) => (
							<div
								key={index}
								className='flex items-start gap-2 p-3 bg-blue-50 rounded-lg'>
								<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
								<p className='text-sm text-gray-700'>{rec}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

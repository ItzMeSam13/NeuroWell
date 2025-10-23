"use client";

import { useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const metrics = [
	{ id: "mood", label: "Mood" },
	{ id: "stress", label: "Stress" },
	{ id: "sleep", label: "Sleep Quality" },
	{ id: "productivity", label: "Productivity" },
];

// Utility: fill empty slots to always have 7 days
function fillWeekData(wellnessData) {
	const filled = [];
	const today = new Date();
	for (let i = 6; i >= 0; i--) {
		const day = new Date(today);
		day.setDate(today.getDate() - i);
		const dayStr = day.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});

		const existing = wellnessData.find((d) => d.date === dayStr);
		if (existing) {
			filled.push(existing);
		} else {
			filled.push({
				date: dayStr,
				mood: null,
				stress: null,
				sleep: null,
				productivity: null,
			});
		}
	}
	return filled;
}

export default function WellnessGraph({ wellnessData }) {
	const [selectedMetric, setSelectedMetric] = useState("mood");
	const currentMetric = metrics.find((m) => m.id === selectedMetric);

	const hasData = wellnessData && wellnessData.length > 0;

	const dataForChart = hasData ? fillWeekData(wellnessData) : [];

	// Compute values ignoring nulls
	const validValues = dataForChart
		.map((d) => d[selectedMetric])
		.filter((v) => v !== null);
	const avg = validValues.length
		? (validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(1)
		: 0;
	const maxVal = validValues.length ? Math.max(...validValues) : 0;
	const minVal = validValues.length ? Math.min(...validValues) : 0;
	const maxDay = validValues.length
		? dataForChart.find((d) => d[selectedMetric] === maxVal)?.date
		: "-";
	const minDay = validValues.length
		? dataForChart.find((d) => d[selectedMetric] === minVal)?.date
		: "-";

	const goodDays = validValues.length
		? dataForChart.filter((d) => {
				if (d[selectedMetric] === null) return false;
				if (selectedMetric === "mood") return d.mood >= 7;
				if (selectedMetric === "stress") return d.stress <= 4;
				if (selectedMetric === "sleep") return d.sleep >= 7;
				if (selectedMetric === "productivity") return d.productivity >= 7;
				return false;
		  }).length
		: 0;

	const badDays = validValues.length ? validValues.length - goodDays : 0;

	return (
		<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-8 w-full'>
			<div className='mb-6'>
				<div className='flex items-center gap-3 mb-3'>
					<div className='p-2 bg-blue-50 rounded-lg'>
						<svg
							className='w-5 h-5 text-blue-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
							/>
						</svg>
					</div>
					<h2 className='text-2xl font-bold text-gray-900'>
						Weekly Wellness Overview
					</h2>
				</div>
				<p className='text-sm text-gray-600 ml-11'>
					Track your mood, stress levels, sleep quality, and productivity trends
				</p>
			</div>

			<div className='flex gap-3 mb-6 flex-wrap'>
				{metrics.map((metric) => (
					<button
						key={metric.id}
						onClick={() => setSelectedMetric(metric.id)}
						className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
							selectedMetric === metric.id
								? "bg-blue-600 text-white shadow-professional"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
						}`}>
						{metric.label}
					</button>
				))}
			</div>

			<div className='bg-gray-50 rounded-xl p-6 border border-gray-200'>
				<ResponsiveContainer width='100%' height={300}>
					<BarChart
						data={dataForChart}
						barSize={40}
						barGap={10}
						margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
						style={{ backgroundColor: "#ffffff", borderRadius: "12px" }}>
						<CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
						<XAxis
							dataKey='date'
							stroke='#6b7280'
							style={{ fontSize: "12px", fontWeight: "500" }}
						/>
						<YAxis
							stroke='#6b7280'
							style={{ fontSize: "12px", fontWeight: "500" }}
							domain={[0, 10]}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "white",
								border: "1px solid #e5e7eb",
								borderRadius: "12px",
								boxShadow:
									"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
								fontSize: "14px",
								fontWeight: "500",
							}}
							cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
						/>
						<Bar
							dataKey={selectedMetric}
							fill='#3b82f6'
							radius={[6, 6, 0, 0]}
							minPointSize={5}
							isAnimationActive={true}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className='mt-6 pt-6 border-t border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='text-center'>
						<div className='text-4xl font-bold text-blue-600 mb-2'>{avg}</div>
						<div className='text-sm text-gray-600 font-medium'>
							Average {currentMetric.label}
						</div>
					</div>
					<div className='space-y-3'>
						<div className='flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg'>
							<span className='text-sm text-gray-700'>Best Day</span>
							<span className='text-sm font-semibold text-green-700'>
								{maxDay} ({maxVal})
							</span>
						</div>
						<div className='flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg'>
							<span className='text-sm text-gray-700'>Lowest Day</span>
							<span className='text-sm font-semibold text-red-700'>
								{minDay} ({minVal})
							</span>
						</div>
						<div className='flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg'>
							<span className='text-sm text-gray-700'>Good Days</span>
							<span className='text-sm font-semibold text-blue-700'>
								{goodDays} / {validValues.length}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

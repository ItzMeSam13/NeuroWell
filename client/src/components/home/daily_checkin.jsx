"use client";

import { useState, useEffect } from "react";
import { Calendar, Flame } from "lucide-react";
import { saveDailyCheckIn } from "@/app/actions/daily_checkin";

export default function DailyCheckIn({ UserData }) {
	const [formData, setFormData] = useState({
		mood: 5,
		stress: 5,
		sleep: 7,
		productivity: 5,
		notes: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [streak, setStreak] = useState(0);
	const [error, setError] = useState(null);
	const [canCheckIn, setCanCheckIn] = useState(true);

	useEffect(() => {
		if (UserData?.streaks) setStreak(UserData.streaks);

		// 24-hour restriction check
		if (UserData?.lastCheckIn) {
			const lastCheck = new Date(UserData.lastCheckIn);
			const now = new Date();
			const diffHours = (now - lastCheck) / (1000 * 60 * 60);
			setCanCheckIn(diffHours >= 24);
		}
	}, [UserData]);

	const handleSliderChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: parseInt(value) }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const res = await saveDailyCheckIn(formData);

			if (res.success) {
				setStreak((prev) => prev + 1); // update streak immediately
				setCanCheckIn(false);
				setShowPopup(false);

				// Refresh the page to update the graph and other data
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			} else {
				setError(res.error || "Something went wrong");
			}
		} catch (err) {
			setError(err.message || "Something went wrong");
		} finally {
			setIsSubmitting(false);
		}
	};

	const getMoodEmoji = (value) => {
		if (value <= 2) return "😢";
		if (value <= 4) return "😕";
		if (value <= 6) return "😐";
		if (value <= 8) return "🙂";
		return "😄";
	};

	const getLevelText = (value) => {
		if (value <= 3) return "Low";
		if (value <= 6) return "Medium";
		return "High";
	};

	const getStressColor = (value) => {
		if (value <= 3) return "text-green-600";
		if (value <= 6) return "text-yellow-600";
		return "text-red-600";
	};

	const getSliderNumberPosition = (value) => {
		const min = 0;
		const max = 10;
		const percentage = ((value - min) / (max - min)) * 100;
		return `calc(${percentage}% - 12px)`;
	};

	const renderSlider = (label, field, min = 0, max = 10, emoji = null) => (
		<div className='bg-gray-50 rounded-xl p-6 border border-gray-200'>
			<label className='flex items-center justify-between mb-4'>
				<span className='font-semibold text-gray-900 text-lg'>{label}</span>
				{emoji ? (
					<span className='text-3xl'>{emoji}</span>
				) : (
					<span
						className={`font-bold text-lg ${getStressColor(formData[field])}`}>
						{getLevelText(formData[field])}
					</span>
				)}
			</label>
			<div className='relative w-full'>
				<div
					className='absolute -top-8 font-bold text-xl text-blue-600 bg-white px-2 py-1 rounded-lg shadow-sm'
					style={{ left: getSliderNumberPosition(formData[field]) }}>
					{formData[field]}
				</div>
				<input
					type='range'
					min={min}
					max={max}
					value={formData[field]}
					onChange={(e) => handleSliderChange(field, e.target.value)}
					className='w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider transition-all duration-150'
				/>
			</div>
		</div>
	);

	return (
		<div className='w-full flex flex-col items-start justify-center'>
			{/* Error notification */}
			{error && (
				<div className='bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 w-full max-w-sm self-center shadow-professional'>
					<div className='flex items-center gap-2'>
						<div className='w-2 h-2 bg-red-500 rounded-full'></div>
						<span className='font-medium'>{error}</span>
					</div>
				</div>
			)}

			{/* Daily Check-In box */}
			<div
				onClick={() => {
					if (canCheckIn) setShowPopup(true); // only open popup if allowed
				}}
				className={`w-full max-w-sm rounded-2xl border p-8 flex flex-col items-center justify-center transition-all duration-300 bg-white text-gray-800 cursor-pointer hover:scale-[1.02] shadow-professional-lg border-gray-200 hover:shadow-xl`}>
				<div className='flex items-center gap-3 mb-4'>
					<div className='p-3 bg-blue-50 rounded-full'>
						<Calendar className='w-6 h-6 text-blue-600' />
					</div>
					<div className='text-left'>
						<h2 className='text-2xl font-bold text-gray-900'>Daily Check-In</h2>
						<p className='text-sm text-gray-500'>
							{new Date().toLocaleDateString("en-US", {
								weekday: "long",
								month: "short",
								day: "numeric",
							})}
						</p>
					</div>
				</div>

				<div className='flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl px-6 py-4 mt-4 w-full shadow-professional'>
					<div className='flex items-center gap-3'>
						<Flame className='w-6 h-6 text-white' />
						<span className='text-4xl font-bold text-white'>{streak || 0}</span>
					</div>
					<p className='text-sm text-white/90 font-medium'>
						{canCheckIn ? "Day Streak" : "Already Checked In"}
					</p>
				</div>
			</div>

			{/* Popup Modal */}
			{showPopup && canCheckIn && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white w-full max-w-4xl rounded-2xl shadow-professional-lg p-8 relative animate-fadeIn overflow-y-auto max-h-[90vh]'>
						<div className='flex items-center gap-3 mb-6'>
							<div className='p-2 bg-blue-50 rounded-lg'>
								<Calendar className='w-5 h-5 text-blue-600' />
							</div>
							<h2 className='text-2xl font-bold text-gray-900'>
								Daily Wellness Check-In
							</h2>
						</div>

						<form onSubmit={handleSubmit} className='space-y-6'>
							{renderSlider("Mood", "mood", 0, 10, getMoodEmoji(formData.mood))}
							{renderSlider("Stress", "stress")}
							{renderSlider("Sleep (hours)", "sleep", 0, 12, "😴")}
							{renderSlider("Productivity", "productivity")}

							<div>
								<label className='block font-semibold text-gray-900 mb-3'>
									Notes (Optional)
								</label>
								<textarea
									value={formData.notes}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, notes: e.target.value }))
									}
									placeholder='How are you feeling today? Share any thoughts or experiences...'
									className='w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none shadow-sm'
								/>
							</div>

							<div className='flex justify-end gap-4 pt-6 border-t border-gray-200'>
								<button
									type='button'
									onClick={() => setShowPopup(false)}
									className='px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm'>
									Cancel
								</button>
								<button
									type='submit'
									disabled={isSubmitting}
									className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-professional'>
									{isSubmitting ? "Submitting..." : "Submit Check-In"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: scale(0.95);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out;
				}
				.slider::-webkit-slider-thumb {
					appearance: none;
					width: 24px;
					height: 24px;
					border-radius: 50%;
					background: white;
					border: 3px solid #3b82f6;
					cursor: pointer;
					transition: all 0.2s ease;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
				.slider::-moz-range-thumb {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					background: white;
					border: 3px solid #3b82f6;
					cursor: pointer;
					transition: all 0.2s ease;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
				.slider:hover::-webkit-slider-thumb {
					transform: scale(1.1);
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
				}
				.slider:hover::-moz-range-thumb {
					transform: scale(1.1);
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
				}
				.slider:active::-webkit-slider-thumb {
					transform: scale(1.2);
					box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
				}
				.slider:active::-moz-range-thumb {
					transform: scale(1.2);
					box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
				}
			`}</style>
		</div>
	);
}

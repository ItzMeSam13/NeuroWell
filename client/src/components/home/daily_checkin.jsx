"use client";

import { useState } from "react";
import { Calendar, Flame, Send, TrendingUp } from "lucide-react";
import { saveDailyCheckIn } from "@/app/actions/daily_checkin"; // import server action

export default function DailyCheckIn() {
  const [formData, setFormData] = useState({
    mood: 5,
    energy: 5,
    stress: 5,
    sleep: 7,
    productivity: 5,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Placeholder streak value - will come from backend later
  const currentStreak = 7;

  const handleSliderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseInt(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call server action directly
      const response = await saveDailyCheckIn(formData);
      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error submitting check-in:", err);
      alert("Failed to submit check-in. Try again.");
    }

    setIsSubmitting(false);
  };

  const getMoodEmoji = (value) => {
    if (value <= 2) return "😢";
    if (value <= 4) return "😕";
    if (value <= 6) return "😐";
    if (value <= 8) return "🙂";
    return "😄";
  };

  const getStressColor = (value) => {
    if (value <= 3) return "text-green-600";
    if (value <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-[#06b6d4] rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">Daily Check-In</h2>
            <p className="text-white/90 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="text-4xl font-bold text-white">{currentStreak}</span>
            </div>
            <p className="text-sm text-white">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-white border-2 border-[#06b6d4] rounded-lg p-4 mb-6 flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 bg-[#06b6d4] rounded-full flex items-center justify-center text-white">
            ✓
          </div>
          <div>
            <p className="font-semibold text-[#06b6d4]">Check-in submitted!</p>
            <p className="text-sm text-gray-600">
              Keep up the great work on your wellness journey.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-8">
          {/* Mood */}
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-800">How's your mood today?</span>
              <span className="text-4xl">{getMoodEmoji(formData.mood)}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.mood}
              onChange={(e) => handleSliderChange("mood", e.target.value)}
              className="w-full h-3 bg-[#06b6d4] rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Very Low</span>
              <span className="font-semibold text-gray-700">{formData.mood}/10</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Energy */}
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-800">Energy Level</span>
              <TrendingUp className={`w-6 h-6 ${formData.energy > 6 ? 'text-green-500' : 'text-gray-400'}`} />
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.energy}
              onChange={(e) => handleSliderChange("energy", e.target.value)}
              className="w-full h-3 bg-[#06b6d4] rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Exhausted</span>
              <span className="font-semibold text-gray-700">{formData.energy}/10</span>
              <span>Energized</span>
            </div>
          </div>

          {/* Stress */}
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-800">Stress Level</span>
              <span className={`font-bold text-xl ${getStressColor(formData.stress)}`}>
                {formData.stress <= 3 ? "Low" : formData.stress <= 6 ? "Medium" : "High"}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.stress}
              onChange={(e) => handleSliderChange("stress", e.target.value)}
              className="w-full h-3 bg-[#06b6d4] rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Relaxed</span>
              <span className="font-semibold text-gray-700">{formData.stress}/10</span>
              <span>Very Stressed</span>
            </div>
          </div>

          {/* Sleep */}
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-800">Hours of Sleep</span>
              <span className="text-2xl">😴</span>
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={formData.sleep}
              onChange={(e) => handleSliderChange("sleep", e.target.value)}
              className="w-full h-3 bg-[#06b6d4] rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>0 hours</span>
              <span className="font-semibold text-gray-700">{formData.sleep} hours</span>
              <span>12 hours</span>
            </div>
          </div>

          {/* Productivity */}
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-800">Productivity</span>
              <span className="text-2xl">
                {formData.productivity > 7 ? "🚀" : formData.productivity > 4 ? "💼" : "🐌"}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.productivity}
              onChange={(e) => handleSliderChange("productivity", e.target.value)}
              className="w-full h-3 bg-[#06b6d4] rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Unproductive</span>
              <span className="font-semibold text-gray-700">{formData.productivity}/10</span>
              <span>Very Productive</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">Additional Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="How are you feeling today? Any thoughts you'd like to share..."
              className="w-full min-h-[100px] p-4 border-2 border-gray-200 rounded-lg focus:border-[#06b6d4] focus:outline-none resize-none text-gray-700"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#06b6d4] text-white font-semibold py-4 rounded-lg hover:bg-[#0891b2] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Check-In
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 3px solid #06b6d4;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 3px solid #06b6d4;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

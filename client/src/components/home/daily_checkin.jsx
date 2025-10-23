"use client";

import { useState } from "react";
import { Calendar, Flame, Send } from "lucide-react";

export default function DailyCheckIn() {
  const [formData, setFormData] = useState({
    mood: 5,
    stress: 5,
    sleep: 7,
    productivity: 5,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setShowPopup(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
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
    <div>
      <label className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800">{label}</span>
        {emoji ? (
          <span className="text-2xl">{emoji}</span>
        ) : (
          <span className={`font-bold ${getStressColor(formData[field])}`}>
            {getLevelText(formData[field])}
          </span>
        )}
      </label>
      <div className="relative w-full mb-6">
        <div
          className="absolute -top-6 font-bold text-lg text-gray-800"
          style={{ left: getSliderNumberPosition(formData[field]) }}
        >
          {formData[field]}
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={formData[field]}
          onChange={(e) => handleSliderChange(field, e.target.value)}
          className="w-full h-2 bg-cyan-400 rounded-lg appearance-none cursor-pointer slider transition-all duration-150"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-start justify-center p-6">
      {showSuccess && (
        <div className="bg-white border-2 border-cyan-400 rounded-lg p-4 mb-6 flex items-center gap-3 shadow-md self-center">
          <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white">
            ✓
          </div>
          <div>
            <p className="font-semibold text-cyan-400">Check-in submitted!</p>
            <p className="text-sm text-gray-600">
              Keep up the great work on your wellness journey.
            </p>
          </div>
        </div>
      )}

      {/* Dashboard Card (White) */}
      <div
        onClick={() => setShowPopup(true)}
        className="bg-white text-gray-800 w-64 h-64 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transform transition-all duration-300 flex flex-col items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-2">Daily Check-In</h2>
        <Calendar className="w-6 h-6 mb-2" />
        <p className="text-gray-500 mb-2">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
        <div className="flex flex-col items-center justify-center bg-cyan-400 rounded-xl px-4 py-2 mt-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-white" />
            <span className="text-3xl font-bold text-white">{currentStreak}</span>
          </div>
          <p className="text-sm text-white/90">Day Streak</p>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6 border-b pb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Daily Check-In</h2>
                <p className="text-gray-500 flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="bg-cyan-400 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-white" />
                  <span className="text-2xl font-bold text-white">{currentStreak}</span>
                </div>
                <p className="text-xs text-white/90">Day Streak</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {renderSlider("Mood", "mood", 0, 10, getMoodEmoji(formData.mood))}
                {renderSlider("Stress", "stress")}
                {renderSlider("Sleep (hours)", "sleep", 0, 12, "😴")}
                {renderSlider("Productivity", "productivity")}

                <div>
                  <label className="block font-semibold text-gray-800 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="How are you feeling today?"
                    className="w-full min-h-[100px] p-3 border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="px-5 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-3 bg-cyan-400 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid cyan;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid cyan;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .slider:active::-webkit-slider-thumb {
          transform: scale(1.2);
        }
        .slider:active::-moz-range-thumb {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}

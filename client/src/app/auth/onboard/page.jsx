'use client'

import { useState } from 'react';
import { ChevronRight, ChevronLeft, UserCircle, Activity, Brain, CheckCircle } from 'lucide-react';

export default function MentalHealthForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: '',
    workspace: '',
    sleepHabits: '',
    physicalActivities: '',
    screenTime: '',
    hasMentalIssue: '',
    mentalIssueDetails: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || formData.age < 1 || formData.age > 120) newErrors.age = 'Valid age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.workspace) newErrors.workspace = 'Workspace type is required';
    if (!formData.sleepHabits) newErrors.sleepHabits = 'Sleep habits are required';
    if (!formData.physicalActivities) newErrors.physicalActivities = 'Physical activities info is required';
    return newErrors;
  };

  const handleNext = () => {
    let newErrors = {};
    
    if (step === 1) {
      newErrors = validateStep1();
    } else if (step === 2) {
      newErrors = validateStep2();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSkip = () => {
    setStep(4);
  };
const handleSubmit = async () => {
  const result = await onboardUser(formData);
  
  if (result.success) {
    setStep(4);
    router.push('/home')
  } else {
    console.error('Onboarding failed:', result.error);
    // Show error message to user
  }
};

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
        <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  );

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Form Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for completing the assessment. Your information has been recorded.</p>
          <button
            onClick={() => {
              setStep(1);
              setFormData({
                name: '', age: '', gender: '', occupation: '',
                workspace: '', sleepHabits: '', physicalActivities: '', screenTime: '',
                hasMentalIssue: '', mentalIssueDetails: ''
              });
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Early Mental Health Detection</h1>
          <p className="text-gray-600">Help us understand you better</p>
        </div>

        {step !== 4 && renderProgressBar()}

        <div>
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <UserCircle className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400`}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.occupation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400`}
                  placeholder="Enter your occupation"
                />
                {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Personal Lifestyle</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace <span className="text-red-500">*</span>
                </label>
                <select
                  name="workspace"
                  value={formData.workspace}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.workspace ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900`}
                >
                  <option value="">Select workspace type</option>
                  <option value="office">Office</option>
                  <option value="remote">Remote/Work from home</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="field">Field work</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
                {errors.workspace && <p className="text-red-500 text-sm mt-1">{errors.workspace}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Habits <span className="text-red-500">*</span>
                </label>
                <select
                  name="sleepHabits"
                  value={formData.sleepHabits}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.sleepHabits ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900`}
                >
                  <option value="">Select sleep duration</option>
                  <option value="less-than-4">Less than 4 hours</option>
                  <option value="4-6">4-6 hours</option>
                  <option value="6-8">6-8 hours</option>
                  <option value="more-than-8">More than 8 hours</option>
                </select>
                {errors.sleepHabits && <p className="text-red-500 text-sm mt-1">{errors.sleepHabits}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physical Activities <span className="text-red-500">*</span>
                </label>
                <select
                  name="physicalActivities"
                  value={formData.physicalActivities}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.physicalActivities ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900`}
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (1-2 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Very Active (6-7 days/week)</option>
                </select>
                {errors.physicalActivities && <p className="text-red-500 text-sm mt-1">{errors.physicalActivities}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screen Time (Optional)
                </label>
                <select
                  name="screenTime"
                  value={formData.screenTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                >
                  <option value="">Select daily screen time</option>
                  <option value="less-than-2">Less than 2 hours</option>
                  <option value="2-4">2-4 hours</option>
                  <option value="4-6">4-6 hours</option>
                  <option value="6-8">6-8 hours</option>
                  <option value="more-than-8">More than 8 hours</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Mental Health (Optional)</h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  This information is optional and will be kept strictly confidential. It helps us provide better support and resources.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you currently have any mental health concerns?
                </label>
                <select
                  name="hasMentalIssue"
                  value={formData.hasMentalIssue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                >
                  <option value="">Select an option</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="unsure">Unsure</option>
                </select>
              </div>

              {formData.hasMentalIssue === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please provide details (Optional)
                  </label>
                  <textarea
                    name="mentalIssueDetails"
                    value={formData.mentalIssueDetails}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-gray-900 placeholder-gray-400"
                    placeholder="You can describe your concerns here. This information is confidential."
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            
            <button
              type="button"
              onClick={step === 3 ? handleSubmit : handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium ml-auto"
            >
              {step === 3 ? 'Submit' : 'Next'}
              {step !== 3 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
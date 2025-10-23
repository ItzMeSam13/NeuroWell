"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, signin } from "@/app/lib/auth";

export default function AuthPage() {
	const [activeTab, setActiveTab] = useState("signup");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSignup = async () => {
		setError("");
		if (!email || !password) {
			setError("Email and password are required.");
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}

		try {
			setIsLoading(true);
			const result = await signup(email, password);
			if (result.success) {
				// Keep loading state until navigation completes
				router.push("/auth/onboard");
				// Don't set isLoading to false here - let it stay true during navigation
			}
		} catch (err) {
			setIsLoading(false); // Only stop loading on error
			if (err instanceof Error) setError(err.message);
			else setError("Something went wrong. Please try again.");
			console.error(err);
		}
	};

	const handleLogin = async () => {
		setError("");
		if (!email || !password) {
			setError("Email and password are required.");
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}
		try {
			setIsLoading(true);
			const result = await signin(email, password);
			if (result.success) {
				// Keep loading state until navigation completes
				router.push("/home");
				// Don't set isLoading to false here - let it stay true during navigation
			}
		} catch (err) {
			setIsLoading(false); // Only stop loading on error
			if (err instanceof Error) setError(err.message);
			else setError("Something went wrong. Please try again.");
			console.error(err);
		}
	};
	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				{/* Header */}
				<div className='text-center mb-8'>
					<div className='flex items-center justify-center gap-3 mb-4'>
						<div className='p-3 bg-blue-50 rounded-xl'>
							<svg
								className='w-8 h-8 text-blue-600'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
								/>
							</svg>
						</div>
						<h1 className='text-3xl font-bold text-gray-900'>NeuroWell</h1>
					</div>
					<p className='text-gray-600'>Your personal wellness companion</p>
				</div>

				{/* Auth Card */}
				<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-8'>
					<div className='flex mb-8 rounded-xl overflow-hidden bg-gray-50 p-1'>
						<button
							onClick={() => setActiveTab("signup")}
							className={`flex-1 py-3 text-center font-semibold transition-all duration-200 rounded-lg ${
								activeTab === "signup"
									? "bg-blue-600 text-white shadow-professional"
									: "text-gray-600 hover:text-gray-900 hover:bg-white"
							}`}>
							Sign Up
						</button>
						<button
							onClick={() => setActiveTab("signin")}
							className={`flex-1 py-3 text-center font-semibold transition-all duration-200 rounded-lg ${
								activeTab === "signin"
									? "bg-blue-600 text-white shadow-professional"
									: "text-gray-600 hover:text-gray-900 hover:bg-white"
							}`}>
							Sign In
						</button>
					</div>

					{activeTab === "signup" && (
						<div>
							<div className='text-center mb-6'>
								<h2 className='text-2xl font-bold text-gray-900 mb-2'>
									Create an Account
								</h2>
								<p className='text-gray-600 text-sm'>
									Join NeuroWell to start your wellness journey
								</p>
							</div>

							{error && (
								<div className='bg-red-50 border border-red-200 text-red-700 text-sm p-4 mb-6 rounded-lg flex items-center gap-2'>
									<div className='w-2 h-2 bg-red-500 rounded-full'></div>
									<span className='font-medium'>{error}</span>
								</div>
							)}

							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-semibold text-gray-700 mb-2'>
										Email Address
									</label>
									<input
										type='email'
										placeholder='Enter your email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400'
									/>
								</div>

								<div>
									<label className='block text-sm font-semibold text-gray-700 mb-2'>
										Password
									</label>
									<input
										type='password'
										placeholder='Create a password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400'
									/>
								</div>
							</div>

							<button
								onClick={handleSignup}
								disabled={isLoading}
								className='w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 hover:shadow-professional transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
								{isLoading ? (
									<>
										<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
										{activeTab === "signup"
											? "Creating Account..."
											: "Signing In..."}
									</>
								) : (
									"Create Account"
								)}
							</button>
						</div>
					)}

					{activeTab === "signin" && (
						<div>
							<div className='text-center mb-6'>
								<h2 className='text-2xl font-bold text-gray-900 mb-2'>
									Welcome Back
								</h2>
								<p className='text-gray-600 text-sm'>
									Sign in to continue your wellness journey
								</p>
							</div>

							{error && (
								<div className='bg-red-50 border border-red-200 text-red-700 text-sm p-4 mb-6 rounded-lg flex items-center gap-2'>
									<div className='w-2 h-2 bg-red-500 rounded-full'></div>
									<span className='font-medium'>{error}</span>
								</div>
							)}

							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-semibold text-gray-700 mb-2'>
										Email Address
									</label>
									<input
										type='email'
										placeholder='Enter your email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400'
									/>
								</div>

								<div>
									<label className='block text-sm font-semibold text-gray-700 mb-2'>
										Password
									</label>
									<input
										type='password'
										placeholder='Enter your password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400'
									/>
								</div>
							</div>

							<button
								onClick={handleLogin}
								disabled={isLoading}
								className='w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 hover:shadow-professional transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
								{isLoading ? (
									<>
										<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
										{activeTab === "signin"
											? "Signing In..."
											: "Creating Account..."}
									</>
								) : (
									"Sign In"
								)}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

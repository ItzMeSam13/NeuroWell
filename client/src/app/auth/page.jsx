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
				router.push("/auth/onboard");
			}
		} catch (err) {
			if (err instanceof Error) setError(err.message);
			else setError("Something went wrong. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
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
				router.push("/home");
			}
		} catch (err) {
			if (err instanceof Error) setError(err.message);
			else setError("Something went wrong. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='min-h-screen flex'>
			<div className='hidden md:flex flex-1 relative'>
				<img
					src='https://www.freepik.com/'
					alt='Demo Image'
					className='w-full h-full object-cover brightness-90'
				/>
			</div>

			<div className='flex flex-1 flex-col justify-center items-center p-8 bg-white'>
				<div className='w-full max-w-md bg-gray-100 rounded-3xl shadow-xl p-8'>
					<div className='flex mb-8 rounded-lg overflow-hidden border border-gray-300'>
						<button
							onClick={() => setActiveTab("signup")}
							className={`flex-1 py-3 text-center font-medium transition-colors ${
								activeTab === "signup"
									? "bg-black text-white font-semibold"
									: "bg-gray-100 text-gray-500 hover:bg-gray-200"
							}`}>
							Sign Up
						</button>
						<button
							onClick={() => setActiveTab("signin")}
							className={`flex-1 py-3 text-center font-medium transition-colors ${
								activeTab === "signin"
									? "bg-black text-white font-semibold"
									: "bg-gray-100 text-gray-500 hover:bg-gray-200"
							}`}>
							Sign In
						</button>
					</div>

					{activeTab === "signup" && (
						<div>
							<h1 className='text-3xl font-semibold text-center mb-6 text-black'>
								Create an Account
							</h1>

							{error && (
								<div className='bg-red-100 text-red-700 text-sm p-3 mb-4 rounded'>
									{error}
								</div>
							)}

							<input
								type='email'
								placeholder='Email address'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='border border-gray-300 rounded-md p-3 mb-4 w-full bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition'
							/>

							<input
								type='password'
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='border border-gray-300 rounded-md p-3 mb-6 w-full bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition'
							/>

							<button
								onClick={handleSignup}
								disabled={isLoading}
								className='bg-black text-white font-semibold py-3 w-full rounded-md hover:bg-gray-900 hover:scale-105 hover:shadow-lg transition transform duration-200 disabled:opacity-50 mb-4c cursor-pointer'>
								{isLoading ? "Loading.." : "Sign Up"}
							</button>
						</div>
					)}

					{activeTab === "signin" && (
						<div>
							<h1 className='text-3xl font-semibold text-center mb-6 text-black'>
								Login
							</h1>

							{error && (
								<div className='bg-red-100 text-red-700 text-sm p-3 mb-4 rounded'>
									{error}
								</div>
							)}

							<input
								type='email'
								placeholder='Email address'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='border border-gray-300 rounded-md p-3 mb-4 w-full bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition'
							/>

							<input
								type='password'
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='border border-gray-300 rounded-md p-3 mb-6 w-full bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition'
							/>

							<button
								onClick={handleLogin}
								disabled={isLoading}
								className='bg-black text-white font-semibold py-3 w-full rounded-md hover:bg-gray-900 hover:scale-105 hover:shadow-lg transition transform duration-200 disabled:opacity-50 mb-4c cursor-pointer'>
								{isLoading ? "loading.." : "Login"}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

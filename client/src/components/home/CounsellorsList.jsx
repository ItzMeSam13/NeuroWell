"use client";

import React, { useState, useEffect } from "react";
import {
	Search,
	Filter,
	Mail,
	User,
	Heart,
	Brain,
	Shield,
	Users,
	Zap,
	Target,
} from "lucide-react";
import {
	getAllCounsellors,
	getCounsellorsBySpecialty,
	searchCounsellorsByName,
	getCounsellorSpecialties,
} from "@/app/lib/counsellors";

export default function CounsellorsList({ userData, wellnessData }) {
	const [counsellors, setCounsellors] = useState([]);
	const [recommendations, setRecommendations] = useState([]);
	const [specialties, setSpecialties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingRecommendations, setIsLoadingRecommendations] =
		useState(true);
	const [isSearching, setIsSearching] = useState(false);
	const [isFiltering, setIsFiltering] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSpecialty, setSelectedSpecialty] = useState("all");
	const [showRecommendations, setShowRecommendations] = useState(true);
	const [analysis, setAnalysis] = useState("");
	const [searchTimeout, setSearchTimeout] = useState(null);

	// Fetch counsellors and specialties
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch all counsellors and specialties from Firebase
				const [counsellorsData, specialtiesData] = await Promise.all([
					getAllCounsellors(),
					getCounsellorSpecialties(),
				]);

				setCounsellors(counsellorsData);
				setSpecialties(specialtiesData);
			} catch (error) {
				console.error("Error fetching counsellors data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Fetch AI recommendations
	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/counsellors/recommendations",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							user_profile: userData,
							wellness_data: wellnessData,
						}),
					}
				);

				if (response.ok) {
					const data = await response.json();
					setRecommendations(data.recommendations || []);
					setAnalysis(data.analysis || "");
				}
			} catch (error) {
				console.error("Error fetching recommendations:", error);
			} finally {
				setIsLoadingRecommendations(false);
			}
		};

		if (userData && wellnessData) {
			fetchRecommendations();
		}
	}, [userData, wellnessData]);

	// Debounced search effect
	useEffect(() => {
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		if (searchTerm.trim()) {
			setIsSearching(true);
			const timeout = setTimeout(() => {
				setIsSearching(false);
			}, 500);
			setSearchTimeout(timeout);
		} else {
			setIsSearching(false);
		}

		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	}, [searchTerm]);

	// Filter effect
	useEffect(() => {
		if (selectedSpecialty !== "all") {
			setIsFiltering(true);
			const timeout = setTimeout(() => {
				setIsFiltering(false);
			}, 300);
			return () => clearTimeout(timeout);
		} else {
			setIsFiltering(false);
		}
	}, [selectedSpecialty]);

	// Filter counsellors based on search and specialty
	const filteredCounsellors = counsellors.filter((counsellor) => {
		const matchesSearch = counsellor.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesSpecialty =
			selectedSpecialty === "all" ||
			counsellor.specialties.some((s) =>
				s.toLowerCase().includes(selectedSpecialty.toLowerCase())
			);
		return matchesSearch && matchesSpecialty;
	});

	// Get specialty icon
	const getSpecialtyIcon = (specialty) => {
		const iconMap = {
			anxiety: Brain,
			depression: Heart,
			trauma: Shield,
			ptsd: Shield,
			"stress-management": Zap,
			"relationship-counseling": Users,
			"family-therapy": Users,
			addiction: Target,
			"substance-abuse": Target,
			"eating-disorders": Heart,
			"body-image": Heart,
			"self-esteem": Heart,
			adhd: Brain,
			"learning-disabilities": Brain,
			"adolescent-therapy": Users,
			"bipolar-disorder": Brain,
			"mood-disorders": Heart,
			ocd: Brain,
			phobias: Shield,
			"grief-counseling": Heart,
			"anger-management": Zap,
			"couples-therapy": Users,
			"child-therapy": Users,
			"elderly-care": Users,
			"workplace-stress": Zap,
			"sleep-disorders": Heart,
			"panic-disorders": Shield,
			"social-anxiety": Brain,
			"general-counseling": Users,
		};
		return iconMap[specialty] || Brain;
	};

	// Get priority color
	const getPriorityColor = (priority) => {
		switch (priority?.toLowerCase()) {
			case "high":
				return "bg-red-50 text-red-700 border-red-200";
			case "medium":
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
			case "low":
				return "bg-green-50 text-green-700 border-green-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	// Format specialty name
	const formatSpecialty = (specialty) => {
		return specialty
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	// Loading state
	if (isLoading) {
		return (
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-8'>
				<div className='flex items-center justify-center py-12'>
					<div className='text-center'>
						<div className='relative mb-4'>
							<div className='animate-spin rounded-full h-12 w-12 border-3 border-blue-200 border-t-blue-600 mx-auto'></div>
							<div className='absolute inset-0 flex items-center justify-center'>
								<Users className='w-5 h-5 text-blue-600 animate-pulse' />
							</div>
						</div>
						<p className='text-gray-600 font-medium'>Loading counsellors...</p>
						<p className='text-sm text-gray-500 mt-1'>
							Fetching available mental health professionals
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-8'>
			{/* Search and Filter Controls */}
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6'>
				<div className='flex flex-col lg:flex-row gap-4'>
					{/* Search Bar */}
					<div className='flex-1'>
						<div className='relative'>
							<Search
								className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
									isSearching ? "text-blue-500 animate-pulse" : "text-gray-400"
								}`}
							/>
							<input
								type='text'
								placeholder='Search counsellors by name...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 ${
									isSearching
										? "border-blue-300 bg-blue-50"
										: "border-gray-300 focus:border-blue-500"
								}`}
							/>
							{isSearching && (
								<div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
									<div className='animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600'></div>
								</div>
							)}
						</div>
						{searchTerm && (
							<div className='mt-2 text-sm text-gray-600'>
								{isSearching ? (
									<span className='flex items-center gap-2'>
										<div className='animate-spin rounded-full h-3 w-3 border border-blue-300 border-t-blue-600'></div>
										Searching for "{searchTerm}"...
									</span>
								) : (
									<span>
										Found {filteredCounsellors.length} counsellor
										{filteredCounsellors.length !== 1 ? "s" : ""} matching "
										{searchTerm}"
									</span>
								)}
							</div>
						)}
					</div>

					{/* Specialty Filter */}
					<div className='lg:w-64'>
						<div className='relative'>
							<Filter
								className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
									isFiltering ? "text-blue-500 animate-pulse" : "text-gray-400"
								}`}
							/>
							<select
								value={selectedSpecialty}
								onChange={(e) => setSelectedSpecialty(e.target.value)}
								className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none appearance-none bg-white transition-all duration-200 ${
									isFiltering
										? "border-blue-300 bg-blue-50"
										: "border-gray-300 focus:border-blue-500"
								}`}>
								<option value='all'>All Specialties</option>
								{specialties.map((specialty) => (
									<option key={specialty} value={specialty}>
										{formatSpecialty(specialty)}
									</option>
								))}
							</select>
							{isFiltering && (
								<div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
									<div className='animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600'></div>
								</div>
							)}
						</div>
						{selectedSpecialty !== "all" && (
							<div className='mt-2 text-sm text-gray-600'>
								{isFiltering ? (
									<span className='flex items-center gap-2'>
										<div className='animate-spin rounded-full h-3 w-3 border border-blue-300 border-t-blue-600'></div>
										Filtering by {formatSpecialty(selectedSpecialty)}...
									</span>
								) : (
									<span>
										Showing {filteredCounsellors.length} counsellor
										{filteredCounsellors.length !== 1 ? "s" : ""} in{" "}
										{formatSpecialty(selectedSpecialty)}
									</span>
								)}
							</div>
						)}
					</div>

					{/* Toggle Recommendations */}
					<button
						onClick={() => setShowRecommendations(!showRecommendations)}
						className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
							showRecommendations
								? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}>
						<Brain className='w-4 h-4' />
						{showRecommendations
							? "Hide AI Recommendations"
							: "Show AI Recommendations"}
					</button>
				</div>

				{/* Active Filters Summary */}
				{(searchTerm || selectedSpecialty !== "all") && (
					<div className='mt-4 pt-4 border-t border-gray-200'>
						<div className='flex items-center gap-2 flex-wrap'>
							<span className='text-sm text-gray-600'>Active filters:</span>
							{searchTerm && (
								<span className='inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
									Search: "{searchTerm}"
									<button
										onClick={() => setSearchTerm("")}
										className='ml-1 hover:bg-blue-200 rounded-full p-0.5'>
										×
									</button>
								</span>
							)}
							{selectedSpecialty !== "all" && (
								<span className='inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
									Specialty: {formatSpecialty(selectedSpecialty)}
									<button
										onClick={() => setSelectedSpecialty("all")}
										className='ml-1 hover:bg-green-200 rounded-full p-0.5'>
										×
									</button>
								</span>
							)}
							<button
								onClick={() => {
									setSearchTerm("");
									setSelectedSpecialty("all");
								}}
								className='text-xs text-gray-500 hover:text-gray-700 underline'>
								Clear all
							</button>
						</div>
					</div>
				)}
			</div>

			{/* AI Recommendations Section */}
			{showRecommendations && (
				<div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-professional-lg border border-blue-200 p-6'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='p-2 bg-blue-100 rounded-lg'>
							<Brain className='w-6 h-6 text-blue-600' />
						</div>
						<div>
							<h3 className='text-xl font-bold text-gray-900'>
								AI-Powered Recommendations
							</h3>
							<p className='text-gray-600 text-sm'>
								Counsellors matched to your specific needs
							</p>
						</div>
					</div>

					{isLoadingRecommendations ? (
						<div className='flex items-center justify-center py-8'>
							<div className='text-center'>
								<div className='relative mb-4'>
									<div className='animate-spin rounded-full h-10 w-10 border-3 border-blue-200 border-t-blue-600 mx-auto'></div>
									<div className='absolute inset-0 flex items-center justify-center'>
										<Brain className='w-4 h-4 text-blue-600 animate-pulse' />
									</div>
								</div>
								<p className='text-gray-600 font-medium'>
									Analyzing your needs...
								</p>
								<p className='text-sm text-gray-500 mt-1'>
									Finding the best counsellors for you
								</p>
							</div>
						</div>
					) : (
						<>
							{analysis && (
								<div className='mb-6 p-4 bg-white rounded-lg border border-blue-200'>
									<p className='text-gray-700 text-sm leading-relaxed'>
										{analysis}
									</p>
								</div>
							)}

							{recommendations.length > 0 ? (
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
									{recommendations.map((counsellor) => (
										<div
											key={counsellor.id}
											className='bg-white rounded-xl shadow-md border border-blue-200 p-4 hover:shadow-lg transition-all duration-300'>
											<div className='flex items-center gap-3 mb-3'>
												<div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
													<User className='w-5 h-5 text-blue-600' />
												</div>
												<div className='flex-1'>
													<h4 className='font-semibold text-gray-900'>
														{counsellor.name}
													</h4>
													<div className='flex items-center gap-2 mt-1'>
														<Mail className='w-3 h-3 text-gray-500' />
														<span className='text-xs text-gray-600'>
															{counsellor.email}
														</span>
													</div>
												</div>
												<span
													className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
														counsellor.priority
													)}`}>
													{counsellor.priority} Match
												</span>
											</div>

											<div className='mb-3'>
												<p className='text-sm text-gray-600 mb-2'>
													{counsellor.reason}
												</p>
												<div className='flex items-center gap-2'>
													<div className='w-full bg-gray-200 rounded-full h-2'>
														<div
															className='bg-blue-600 h-2 rounded-full'
															style={{
																width: `${counsellor.match_score * 10}%`,
															}}></div>
													</div>
													<span className='text-xs text-gray-500'>
														{counsellor.match_score}/10
													</span>
												</div>
											</div>

											<div className='flex flex-wrap gap-1'>
												{counsellor.specialties.map((specialty, index) => {
													const IconComponent = getSpecialtyIcon(specialty);
													return (
														<span
															key={index}
															className='text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1'>
															<IconComponent className='w-3 h-3' />
															{formatSpecialty(specialty)}
														</span>
													);
												})}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className='text-center py-8'>
									<Brain className='w-12 h-12 text-gray-400 mx-auto mb-4' />
									<p className='text-gray-600'>
										No recommendations available at the moment.
									</p>
									<p className='text-sm text-gray-500 mt-1'>
										Try browsing all counsellors below.
									</p>
								</div>
							)}
						</>
					)}
				</div>
			)}

			{/* All Counsellors Section */}
			<div className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6'>
				<div className='flex items-center justify-between mb-6'>
					<div>
						<h3 className='text-xl font-bold text-gray-900'>All Counsellors</h3>
						<div className='text-gray-600 text-sm'>
							{isSearching || isFiltering ? (
								<div className='flex items-center gap-2'>
									<div className='animate-spin rounded-full h-3 w-3 border border-blue-300 border-t-blue-600'></div>
									{isSearching ? "Searching..." : "Filtering..."}
								</div>
							) : (
								<span>
									{filteredCounsellors.length} counsellor
									{filteredCounsellors.length !== 1 ? "s" : ""} found
									{searchTerm && ` for "${searchTerm}"`}
									{selectedSpecialty !== "all" &&
										` in ${formatSpecialty(selectedSpecialty)}`}
								</span>
							)}
						</div>
					</div>
					{(searchTerm || selectedSpecialty !== "all") && (
						<button
							onClick={() => {
								setSearchTerm("");
								setSelectedSpecialty("all");
							}}
							className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
							Clear filters
						</button>
					)}
				</div>

				{/* Loading State for Search/Filter */}
				{(isSearching || isFiltering) && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[1, 2, 3].map((i) => (
							<div key={i} className='bg-gray-50 rounded-2xl p-6 animate-pulse'>
								<div className='flex items-center gap-4 mb-4'>
									<div className='w-12 h-12 bg-gray-300 rounded-full'></div>
									<div className='flex-1'>
										<div className='h-4 bg-gray-300 rounded w-3/4 mb-2'></div>
										<div className='h-3 bg-gray-300 rounded w-1/2'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='h-3 bg-gray-300 rounded w-1/3'></div>
									<div className='h-3 bg-gray-300 rounded w-1/2'></div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Results */}
				{!isSearching && !isFiltering && (
					<>
						{filteredCounsellors.length === 0 ? (
							<div className='text-center py-12'>
								<Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
								<h3 className='text-lg font-semibold text-gray-700 mb-2'>
									{searchTerm || selectedSpecialty !== "all"
										? "No Counsellors Found"
										: "No Counsellors Available"}
								</h3>
								<p className='text-gray-500 mb-4'>
									{searchTerm || selectedSpecialty !== "all"
										? "Try adjusting your search or filter criteria."
										: "No counsellors are currently available in the system."}
								</p>
								{(searchTerm || selectedSpecialty !== "all") && (
									<button
										onClick={() => {
											setSearchTerm("");
											setSelectedSpecialty("all");
										}}
										className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'>
										Clear all filters
									</button>
								)}
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{filteredCounsellors.map((counsellor) => (
									<div
										key={counsellor.id}
										className='bg-white rounded-2xl shadow-professional-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300'>
										{/* Counsellor Header */}
										<div className='flex items-center gap-4 mb-4'>
											<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
												<User className='w-6 h-6 text-blue-600' />
											</div>
											<div className='flex-1'>
												<h4 className='font-semibold text-gray-900 text-lg'>
													{counsellor.name}
												</h4>
												<div className='flex items-center gap-2 mt-1'>
													<Mail className='w-4 h-4 text-gray-500' />
													<span className='text-sm text-gray-600'>
														{counsellor.email}
													</span>
												</div>
											</div>
										</div>

										{/* Specialty */}
										<div className='mb-4'>
											<div className='flex flex-wrap gap-2'>
												{counsellor.specialties.map((specialty, index) => {
													const IconComponent = getSpecialtyIcon(specialty);
													return (
														<span
															key={index}
															className='text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2'>
															<IconComponent className='w-4 h-4' />
															{formatSpecialty(specialty)}
														</span>
													);
												})}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

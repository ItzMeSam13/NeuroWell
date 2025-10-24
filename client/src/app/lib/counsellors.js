// lib/counsellors.js
import { db } from "@/Firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Fetches all counsellors from the 'counsellors' collection in Firebase
 * @returns {Array} Array of counsellor objects
 */
export async function getAllCounsellors() {
	try {
		const colRef = collection(db, "counsellors");
		const snapshot = await getDocs(colRef);

		const counsellors = snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				name: data.name || "Unknown Counsellor",
				email: data.emailid || data.email || "",
				specialties: data.speciality ? [data.speciality] : [],
				experience_years: data.experience_years || 0,
				rating: data.rating || 4.5,
				languages: data.languages || ["English"],
				availability: data.availability || "Contact for availability",
				bio:
					data.bio ||
					"Professional counsellor specializing in mental health support.",
				price_per_session: data.price_per_session || 100,
				image:
					data.image ||
					"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
			};
		});

		return counsellors;
	} catch (error) {
		console.error("Error fetching counsellors:", error);
		return [];
	}
}

/**
 * Fetches counsellors filtered by specialty
 * @param {string} specialty - The specialty to filter by
 * @returns {Array} Array of filtered counsellor objects
 */
export async function getCounsellorsBySpecialty(specialty) {
	try {
		if (!specialty || specialty.toLowerCase() === "all") {
			return await getAllCounsellors();
		}

		const colRef = collection(db, "counsellors");
		const q = query(colRef, where("speciality", "==", specialty));
		const snapshot = await getDocs(q);

		const counsellors = snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				name: data.name || "Unknown Counsellor",
				email: data.emailid || data.email || "",
				specialties: data.speciality ? [data.speciality] : [],
				experience_years: data.experience_years || 0,
				rating: data.rating || 4.5,
				languages: data.languages || ["English"],
				availability: data.availability || "Contact for availability",
				bio:
					data.bio ||
					"Professional counsellor specializing in mental health support.",
				price_per_session: data.price_per_session || 100,
				image:
					data.image ||
					"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
			};
		});

		return counsellors;
	} catch (error) {
		console.error("Error fetching counsellors by specialty:", error);
		return [];
	}
}

/**
 * Searches counsellors by name
 * @param {string} searchTerm - The search term
 * @returns {Array} Array of matching counsellor objects
 */
export async function searchCounsellorsByName(searchTerm) {
	try {
		const allCounsellors = await getAllCounsellors();

		if (!searchTerm) {
			return allCounsellors;
		}

		const searchLower = searchTerm.toLowerCase();
		return allCounsellors.filter((counsellor) =>
			counsellor.name.toLowerCase().includes(searchLower)
		);
	} catch (error) {
		console.error("Error searching counsellors:", error);
		return [];
	}
}

/**
 * Gets all unique specialties from the counsellors collection
 * @returns {Array} Array of unique specialty strings
 */
export async function getCounsellorSpecialties() {
	try {
		const counsellors = await getAllCounsellors();
		const specialties = new Set();

		counsellors.forEach((counsellor) => {
			counsellor.specialties.forEach((specialty) => {
				specialties.add(specialty);
			});
		});

		// Add predefined specialties to ensure comprehensive coverage
		const predefinedSpecialties = [
			"anxiety",
			"depression",
			"trauma",
			"ptsd",
			"stress-management",
			"relationship-counseling",
			"family-therapy",
			"addiction",
			"substance-abuse",
			"eating-disorders",
			"body-image",
			"self-esteem",
			"adhd",
			"learning-disabilities",
			"adolescent-therapy",
			"bipolar-disorder",
			"mood-disorders",
			"ocd",
			"phobias",
			"grief-counseling",
			"anger-management",
			"couples-therapy",
			"child-therapy",
			"elderly-care",
			"workplace-stress",
			"sleep-disorders",
			"panic-disorders",
			"social-anxiety",
			"general-counseling",
		];

		// Combine database specialties with predefined ones
		predefinedSpecialties.forEach((specialty) => specialties.add(specialty));

		return Array.from(specialties).sort();
	} catch (error) {
		console.error("Error fetching specialties:", error);
		// Return predefined specialties as fallback
		return [
			"anxiety",
			"depression",
			"trauma",
			"ptsd",
			"stress-management",
			"relationship-counseling",
			"family-therapy",
			"addiction",
			"substance-abuse",
			"eating-disorders",
			"body-image",
			"self-esteem",
			"adhd",
			"learning-disabilities",
			"adolescent-therapy",
			"bipolar-disorder",
			"mood-disorders",
			"ocd",
			"phobias",
			"grief-counseling",
			"anger-management",
			"couples-therapy",
			"child-therapy",
			"elderly-care",
			"workplace-stress",
			"sleep-disorders",
			"panic-disorders",
			"social-anxiety",
			"general-counseling",
		].sort();
	}
}

// lib/dailyData.js
import { db } from "@/Firebase/config"; // your firebase client
import { collection, where, getDocs, query } from "firebase/firestore";

/**
 * Fetches the last 7 daily check-ins of the current user from Firebase
 * @param {string} userId
 * @returns {Array}
 */
export async function getDailyData(userId) {
	if (!userId) return [];

	const colRef = collection(db, "dailycheckin");
	const q = query(colRef, where("userId", "==", userId));

	const snapshot = await getDocs(q);

	const data = snapshot.docs
		.map((doc) => {
			const d = doc.data();
			return {
				createdAt: d.createdAt?.toDate?.() || new Date(0),
				date:
					d.createdAt?.toDate?.().toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					}) || "N/A",
				mood: d.mood,
				stress: d.stress,
				sleep: d.sleep,
				productivity: d.productivity,
			};
		})
		.sort((a, b) => b.createdAt - a.createdAt) // newest first
		.slice(0, 7)
		.reverse(); // oldest first for graph

	return data;
}

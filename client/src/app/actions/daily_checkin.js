// src/app/actions/dailycheckin.js
"use server";
import { db } from "@/Firebase/config";
import {
	collection,
	addDoc,
	serverTimestamp,
	doc,
	getDoc,
	updateDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { getUser } from "@/app/lib/getUser";

export async function saveDailyCheckIn(data) {
	try {
		const user = await getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const userId = user.user_id;
		const userRef = doc(db, "users", userId);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) {
			return { success: false, error: "User not found" };
		}

		const userData = userSnap.data();
		const lastCheckIn = userData.lastCheckIn?.toDate?.() || new Date(0);
		const now = new Date();
		const diffHours = (now - lastCheckIn) / (1000 * 60 * 60);

		if (diffHours < 24) {
			return {
				success: false,
				error: "You can only submit once every 24 hours.",
			};
		}

		// Calculate streak based on time gap
		let newStreak = 1; // Default to 1 for new check-in
		const diffDays = Math.floor(diffHours / 24);

		if (lastCheckIn.getTime() > 0) {
			// If there was a previous check-in
			if (diffDays === 1) {
				// Consecutive day - increment streak
				newStreak = (userData.streaks || 0) + 1;
			} else if (diffDays > 1) {
				// Gap of more than 1 day - reset streak to 1
				newStreak = 1;
			}
		}

		// Save daily check-in
		const docRef = await addDoc(collection(db, "dailycheckin"), {
			userId,
			mood: data.mood,
			stress: data.stress,
			sleep: data.sleep,
			productivity: data.productivity,
			notes: data.notes || null,
			createdAt: serverTimestamp(),
		});

		// Update streak and lastCheckIn
		await updateDoc(userRef, {
			streaks: newStreak,
			lastCheckIn: serverTimestamp(),
		});

		return { success: true, id: docRef.id };
	} catch (err) {
		console.error("Error saving daily check-in:", err);
		return { success: false, error: err.message };
	}
}

export async function checkAndResetStreaks() {
	try {
		// Get all users
		const usersRef = collection(db, "users");
		const usersSnapshot = await getDocs(usersRef);
		const now = new Date();
		const resetCount = [];

		for (const userDoc of usersSnapshot.docs) {
			const userData = userDoc.data();
			const lastCheckIn = userData.lastCheckIn?.toDate?.() || new Date(0);
			const diffHours = (now - lastCheckIn) / (1000 * 60 * 60);
			const diffDays = Math.floor(diffHours / 24);

			// If user hasn't checked in for more than 1 day and has a streak > 0
			if (diffDays > 1 && (userData.streaks || 0) > 0) {
				await updateDoc(doc(db, "users", userDoc.id), {
					streaks: 0,
				});
				resetCount.push(userDoc.id);
			}
		}

		console.log(
			`Reset streaks for ${resetCount.length} users who missed check-ins`
		);
		return {
			success: true,
			resetCount: resetCount.length,
			usersReset: resetCount,
		};
	} catch (err) {
		console.error("Error checking and resetting streaks:", err);
		return { success: false, error: err.message };
	}
}

export async function getUserStreakStatus() {
	try {
		const user = await getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const userId = user.user_id;
		const userRef = doc(db, "users", userId);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) {
			return { success: false, error: "User not found" };
		}

		const userData = userSnap.data();
		const lastCheckIn = userData.lastCheckIn?.toDate?.() || new Date(0);
		const now = new Date();
		const diffHours = (now - lastCheckIn) / (1000 * 60 * 60);
		const diffDays = Math.floor(diffHours / 24);

		// Check if streak should be reset
		let shouldReset = false;
		if (diffDays > 1 && (userData.streaks || 0) > 0) {
			shouldReset = true;
			// Reset the streak
			await updateDoc(userRef, {
				streaks: 0,
			});
		}

		return {
			success: true,
			currentStreak: shouldReset ? 0 : userData.streaks || 0,
			lastCheckIn: lastCheckIn,
			daysSinceLastCheckIn: diffDays,
			streakReset: shouldReset,
		};
	} catch (err) {
		console.error("Error getting user streak status:", err);
		return { success: false, error: err.message };
	}
}

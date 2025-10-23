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

		// Increment streak and update lastCheckIn
		const currentStreak = (userData.streaks || 0) + 1;
		await updateDoc(userRef, {
			streaks: currentStreak,
			lastCheckIn: serverTimestamp(),
		});

		return { success: true, id: docRef.id };
	} catch (err) {
		console.error("Error saving daily check-in:", err);
		return { success: false, error: err.message };
	}
}

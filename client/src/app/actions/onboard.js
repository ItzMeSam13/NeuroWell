// app/lib/onboard.js
"use server";

import { db } from "@/Firebase/config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getUser } from "@/app/lib/getUser";

export async function onboardUser(formData) {
	try {
		const user = await getUser();
		console.log("Authenticated user:", user);

		if (!user || !user.user_id) {
			throw new Error("User not authenticated");
		}

		const uid = user.user_id; // ✅ fix here

		const userData = {
			name: formData.name || "",
			age: formData.age ? parseInt(formData.age) : null,
			gender: formData.gender || "",
			occupation: formData.occupation || "",
			workspace: formData.workspace || "",
			sleepHabits: formData.sleepHabits || "",
			physicalActivities: formData.physicalActivities || "",
			screenTime: formData.screenTime || null,
			hasMentalIssue: formData.hasMentalIssue || null,
			mentalIssueDetails: formData.mentalIssueDetails || null,
			onboardingCompleted: true,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		};

		const userRef = doc(db, "users", uid);
		await setDoc(userRef, userData, { merge: true });

		return {
			success: true,
			userId: uid,
			message: "User onboarding completed successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error.message || "Failed to complete onboarding",
		};
	}
}

export async function hasCompletedOnboarding() {
	try {
		const user = await getUser();

		if (!user || !user.user_id) return false;

		const userRef = doc(db, "users", user.user_id);
		const userDoc = await getDoc(userRef);

		return userDoc.exists() && userDoc.data().onboardingCompleted === true;
	} catch (error) {
		return false;
	}
}

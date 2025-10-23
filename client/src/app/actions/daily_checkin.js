// src/app/actions/dailycheckin.js
"use server";
import { db } from "@/Firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getUser } from "@/app/lib/getUser"; // Server-only function

export async function saveDailyCheckIn(data) {
  try {
    const user = await getUser(); // ✅ server-side only
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const docRef = await addDoc(collection(db, "dailycheckin"), {
      userId: user.user_id,
      mood: data.mood,
      stress: data.stress,
      sleep: data.sleep,
      productivity: data.productivity,
      notes: data.notes || null,
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Error saving daily check-in:", err);
    return { success: false, error: err.message };
  }
}

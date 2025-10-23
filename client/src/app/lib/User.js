import { doc, getDoc } from "firebase/firestore";
import { db } from "@/Firebase/config";

/**
 * Fetch user data by document ID from 'users' collection
 * Converts Firestore timestamps to plain ISO strings.
 */
export async function getUserById(docId) {
	try {
		const docRef = doc(db, "users", docId);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			console.log("No such document!");
			return null;
		}

		const data = docSnap.data();

		// Convert all Firestore timestamps to ISO strings
		const plainData = Object.fromEntries(
			Object.entries(data).map(([key, value]) => {
				if (value?.toDate) {
					return [key, value.toDate().toISOString()];
				}
				return [key, value];
			})
		);

		return { id: docSnap.id, ...plainData };
	} catch (err) {
		console.error("Error fetching user:", err);
		return null;
	}
}


export async function getDailyData(){
	
}



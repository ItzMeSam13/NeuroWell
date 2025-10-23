"use server";
import { auth } from "@/Firebase/config";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { cookies } from "next/headers";

export async function signup(email, password) {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		const idToken = await user.getIdToken();
		const cookieStore = await cookies();

		cookieStore.set("authToken", idToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
			secure: process.env.NODE_ENV === "production",
			path: "/",
		});
		return { success: true, uid: user.uid };
	} catch (error) {
		throw error;
	}
}

export async function signin(email, password) {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		const idToken = await user.getIdToken();
		const cookieStore = await cookies();

		cookieStore.set("authToken", idToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
			secure: process.env.NODE_ENV === "production",
			path: "/",
		});

		return { success: true, uid: user.uid };
	} catch (error) {
		throw error;
	}
}

export async function signout() {
	try {
		const cookieStore = await cookies();
		cookieStore.delete("authToken");
		await signOut(auth);
		return { success: true };
	} catch (error) {
		throw error;
	}
}

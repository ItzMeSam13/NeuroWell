"use server";
import { cookies } from "next/headers";
export default async function setCookie(user) {
	const idToken = await user.getIdToken();
	const cookieStore = await cookies();

	cookieStore.set("authToken", idToken, {
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7,
		secure: process.env.NODE_ENV === "production",
		path: "/",
	});
}

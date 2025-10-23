// app/lib/getUser.js
import { cookies } from "next/headers";

export async function getUser() {
	const cookieStore = await cookies();
	const token = cookieStore.get("authToken")?.value;

	if (!token) {
		return null;
	}

	try {
		const decoded = JSON.parse(
			Buffer.from(token.split(".")[1], "base64").toString()
		);
		return decoded;
	} catch (error) {
		return null;
	}
}

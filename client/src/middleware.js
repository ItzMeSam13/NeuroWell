import { NextResponse } from "next/server";

export async function middleware(request) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/home")) {
		const token = request.cookies.get("authToken")?.value;

		if (!token) {
			return NextResponse.redirect(new URL("/auth", request.url));
		}
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/home/:path*"],
};

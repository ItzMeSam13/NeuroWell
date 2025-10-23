import { NextResponse } from "next/server";

export async function middleware(request) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("authToken")?.value;

	// Protect /home routes
	if (pathname.startsWith("/home")) {
		if (!token) {
			return NextResponse.redirect(new URL("/auth", request.url));
		}
		return NextResponse.next();
	}

	// Protect /auth/onboard route
	if (pathname.startsWith("/auth/onboard")) {
		if (!token) {
			return NextResponse.redirect(new URL("/auth", request.url));
		}
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/home/:path*", "/auth/onboard/:path*"],
};
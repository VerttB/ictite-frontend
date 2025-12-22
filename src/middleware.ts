import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token");
    const protectedRoutes = ["/console", "/console/v2"];
    const isProtected = protectedRoutes.some((path) =>
        req.nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !token) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

const isTokenExpired = (token: string): boolean => { return true}

export const config = {
    matcher: ["/console/:path*", "/console/v2/:path*"],
};

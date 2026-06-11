import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

export async function proxy(req: NextRequest) {
    const tokenCookie = req.cookies.get("access_token");
    const token = tokenCookie?.value;

    const protectedRoutes = ["/console", "/console/v2"];
    const isProtected = protectedRoutes.some((path) =>
        req.nextUrl.pathname.startsWith(path)
    );

    if (isProtected) {
        if (!token) {
            const loginUrl = new URL("/login", req.url);
            return NextResponse.redirect(loginUrl);
        }

        try {
            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET || "default_secret_change_me"
            );
            await jwtVerify(token, secret);
        } catch (error) {
            console.error("Security Alert: Invalid or expired token in proxy:", error);
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("access_token");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/console/:path*", "/console/v2/:path*"],
};

import { NextResponse, type NextRequest } from "next/server";
import { getConsolePath } from "@/core/utils/authNavigation";
import { getSessionUser } from "@/core/utils/session";

function loginRedirect(req: NextRequest, clearCookie = false) {
    const target = new URL(`${req.nextUrl.basePath}/login/`, req.url);
    target.searchParams.set("redirect", `${req.nextUrl.pathname}${req.nextUrl.search}`);
    const response = NextResponse.redirect(target);
    response.headers.set("Cache-Control", "no-store");
    if (clearCookie)
        response.cookies.set("access_token", "", {
            path: "/",
            maxAge: 0,
            httpOnly: true,
        });
    return response;
}

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return loginRedirect(req);
    try {
        const user = await getSessionUser(token);
        if (!user) return loginRedirect(req, true);
        const schoolConsole =
            req.nextUrl.pathname === "/school/console" ||
            req.nextUrl.pathname.startsWith("/school/console/");
        const requiredRole = schoolConsole ? "SCHOOL_ADMIN" : "ADMIN";
        if (user.role !== requiredRole) {
            return NextResponse.redirect(
                new URL(`${req.nextUrl.basePath}${getConsolePath(user.role)}/`, req.url)
            );
        }
        const response = NextResponse.next();
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch {
        return new NextResponse(
            "Não foi possível validar sua sessão. Tente novamente em instantes.",
            {
                status: 503,
                headers: {
                    "Cache-Control": "no-store",
                    "Content-Type": "text/plain; charset=utf-8",
                },
            }
        );
    }
}

export const config = { matcher: ["/console/:path*", "/school/console/:path*"] };

import type { UserRole } from "@/core/domain/User";
import type { Route } from "next";

export function getConsolePath(role: UserRole): "/console/v2" | "/school/console" {
    return role === "ADMIN" ? "/console/v2" : "/school/console";
}

export function getLoginReturnPath(
    value: string | null,
    role: UserRole,
    basePath = ""
): Route {
    const fallback = getConsolePath(role);
    if (
        !value ||
        !value.startsWith("/") ||
        value.startsWith("//") ||
        /[\\\r\n]/.test(value)
    )
        return fallback;
    const url = new URL(value, "https://ictite.local");
    if (url.origin !== "https://ictite.local") return fallback;
    let path = url.pathname;
    if (basePath && (path === basePath || path.startsWith(`${basePath}/`)))
        path = path.slice(basePath.length) || "/";
    if (path !== fallback && !path.startsWith(`${fallback}/`)) return fallback;
    return `${path}${url.search}${url.hash}` as Route;
}

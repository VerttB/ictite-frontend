import { UserSchema, type User } from "@/core/domain/User";
import { getBaseUrl } from "./api";

export async function getSessionUser(token: string): Promise<User | null> {
    const response = await fetch(`${getBaseUrl()}/auth/me`, {
        headers: { Cookie: `access_token=${token}` },
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(8000),
    });
    if (response.status === 401 || response.status === 403) return null;
    if (!response.ok) throw new Error("Não foi possível validar a sessão.");
    const result = UserSchema.safeParse(await response.json());
    if (
        !result.success ||
        (result.data.role === "SCHOOL_ADMIN" && !result.data.school_id)
    )
        return null;
    return result.data;
}

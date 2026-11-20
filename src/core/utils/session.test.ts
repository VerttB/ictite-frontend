import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSessionUser } from "./session";
const fetchMock = vi.fn();
beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("API_INTERNAL_URL", "http://api:8000");
    fetchMock.mockReset();
});
afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});
describe("sessão consultada na API", () => {
    it("envia somente o cookie da sessão à origem configurada e não segue redirecionamento", async () => {
        const user = { id: "id", email: "admin@example.test", role: "ADMIN" };
        fetchMock.mockResolvedValue(Response.json(user));
        expect(await getSessionUser("session-token")).toEqual(user);
        expect(fetchMock).toHaveBeenCalledWith(
            "http://api:8000/auth/me",
            expect.objectContaining({
                cache: "no-store",
                redirect: "error",
                headers: { Cookie: "access_token=session-token" },
            })
        );
    });
    it.each([401, 403])("trata resposta %s como sessão ausente", async (status) => {
        fetchMock.mockResolvedValue(new Response(null, { status }));
        expect(await getSessionUser("token")).toBeNull();
    });
    it("não confunde indisponibilidade com logout", async () => {
        fetchMock.mockResolvedValue(new Response(null, { status: 503 }));
        await expect(getSessionUser("token")).rejects.toThrow();
    });
    it.each([
        { role: "MANAGER" },
        { role: "VIEWER" },
        { role: "SCHOOL_ADMIN", school_id: null },
    ])("recusa perfil incompatível: %j", async (profile) => {
        fetchMock.mockResolvedValue(
            Response.json({ id: "id", email: "user@example.test", ...profile })
        );
        expect(await getSessionUser("token")).toBeNull();
    });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";
import { getSessionUser } from "@/core/utils/session";

vi.mock("@/core/utils/session", () => ({ getSessionUser: vi.fn() }));
const admin = { id: "test-id", email: "admin@example.test", role: "ADMIN" as const };
const school = { ...admin, role: "SCHOOL_ADMIN" as const, school_id: "school-id" };
beforeEach(() => {
    vi.mocked(getSessionUser).mockReset();
});
afterEach(() => vi.restoreAllMocks());
function request(path: string, basePath = "", cookie = "") {
    return new NextRequest(`https://ictite.example.test${basePath}${path}`, {
        nextConfig: { basePath },
        headers: cookie ? { Cookie: `access_token=${cookie}` } : {},
    });
}

describe("sessão e autorização dos consoles", () => {
    it.each(["", "/ictite/v1/web"])(
        "mantém login e retorno com prefixo '%s'",
        async (prefix) => {
            const result = await proxy(
                request("/console/v2/submissions/?status=PENDENTE", prefix)
            );
            const target = new URL(result.headers.get("location")!);
            expect(target.pathname).toBe(`${prefix}/login/`);
            expect(target.searchParams.get("redirect")).toBe(
                "/console/v2/submissions/?status=PENDENTE"
            );
            expect(getSessionUser).not.toHaveBeenCalled();
        }
    );
    it.each(["invalid", "expired", "deleted-user"])(
        "remove sessão rejeitada pela API: %s",
        async (token) => {
            vi.mocked(getSessionUser).mockResolvedValue(null);
            const result = await proxy(request("/console/v2/", "/ictite/v1/web", token));
            expect(new URL(result.headers.get("location")!).pathname).toBe(
                "/ictite/v1/web/login/"
            );
            expect(result.headers.get("set-cookie")).toContain("Max-Age=0");
        }
    );
    it("permite ADMIN no console geral e bloqueia console escolar sem escola selecionada", async () => {
        vi.mocked(getSessionUser).mockResolvedValue(admin);
        expect(
            (await proxy(request("/console/v2/", "", "session"))).headers.get(
                "x-middleware-next"
            )
        ).toBe("1");
        const denied = await proxy(
            request("/school/console/", "/ictite/v1/web", "session")
        );
        expect(new URL(denied.headers.get("location")!).pathname).toBe(
            "/ictite/v1/web/console/v2/"
        );
    });
    it("permite SCHOOL_ADMIN apenas no console escolar", async () => {
        vi.mocked(getSessionUser).mockResolvedValue(school);
        expect(
            (await proxy(request("/school/console/", "", "session"))).headers.get(
                "x-middleware-next"
            )
        ).toBe("1");
        const denied = await proxy(request("/console/v2/escolas/", "", "session"));
        expect(new URL(denied.headers.get("location")!).pathname).toBe(
            "/school/console/"
        );
    });
    it("nega acesso se a API falhar, preservando o cookie para nova tentativa", async () => {
        vi.mocked(getSessionUser).mockRejectedValue(new Error("unavailable"));
        const result = await proxy(request("/console/v2/", "", "session"));
        expect(result.status).toBe(503);
        expect(result.headers.get("set-cookie")).toBeNull();
        expect(result.headers.get("cache-control")).toBe("no-store");
    });
});

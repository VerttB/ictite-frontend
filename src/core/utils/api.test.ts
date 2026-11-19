import { afterEach, describe, expect, it, vi } from "vitest";
import { getBaseUrl, getAssetPrefix } from "./api";

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});
describe("configuração de API e prefixo", () => {
    it("usa a API pública configurada no navegador", () => {
        vi.stubGlobal("window", {});
        vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://public.example.test/ictite/api/");
        vi.stubEnv("API_INTERNAL_URL", "http://private-api:8000");
        expect(getBaseUrl()).toBe("https://public.example.test/ictite/api");
    });
    it("permite um endereço privado apenas no servidor", () => {
        vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://public.example.test/api");
        vi.stubEnv("API_INTERNAL_URL", "http://api:8000/");
        expect(getBaseUrl()).toBe("http://api:8000");
    });
    it("usa a API pública no servidor quando não há endereço privado", () => {
        vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://public.example.test/api");
        vi.stubEnv("API_INTERNAL_URL", "");
        expect(getBaseUrl()).toBe("https://public.example.test/api");
    });
    it("rejeita configuração ausente", () => {
        vi.stubEnv("NEXT_PUBLIC_BASE_URL", "");
        vi.stubEnv("API_INTERNAL_URL", "");
        expect(getBaseUrl).toThrow("NEXT_PUBLIC_BASE_URL");
    });
    it.each(["", "/ictite/v1/web"])("respeita prefixo configurado: %s", (prefix) => {
        vi.stubEnv("NEXT_PUBLIC_BASE_PATH", prefix);
        expect(getAssetPrefix()).toBe(prefix);
    });
});

import { describe, expect, it } from "vitest";
import { getConsolePath, getLoginReturnPath } from "./authNavigation";

describe("navegação de autenticação", () => {
    it("separa consoles por perfil", () => {
        expect(getConsolePath("ADMIN")).toBe("/console/v2");
        expect(getConsolePath("SCHOOL_ADMIN")).toBe("/school/console");
    });
    it.each([
        null,
        "https://outside.test",
        "//outside.test",
        "/\\outside.test",
        "/console/v2evil",
        "/school/console",
    ])("não aceita retorno administrativo inválido: %s", (value) => {
        expect(getLoginReturnPath(value, "ADMIN")).toBe("/console/v2");
    });
    it("preserva o destino autorizado com busca e remove apenas o prefixo configurado", () => {
        expect(
            getLoginReturnPath(
                "/ictite/v1/web/console/v2/submissions/?status=PENDENTE",
                "ADMIN",
                "/ictite/v1/web"
            )
        ).toBe("/console/v2/submissions/?status=PENDENTE");
        expect(getLoginReturnPath("/school/console/", "SCHOOL_ADMIN")).toBe(
            "/school/console/"
        );
        expect(getLoginReturnPath("/console/v2/", "SCHOOL_ADMIN")).toBe(
            "/school/console"
        );
    });
});

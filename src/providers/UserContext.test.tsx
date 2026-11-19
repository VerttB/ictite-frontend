// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import UserProvider, { useUserContext } from "./UserContext";
import Login from "@/app/(paginas)/(auth)/login/page";
import { login, logout, me, registerInvited } from "@/core/service/AuthService";
import type { User } from "@/core/domain/User";

const { router, toastError } = vi.hoisted(() => ({
    router: { push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn() },
    toastError: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("sonner", () => ({ toast: { error: toastError } }));
vi.mock("@/core/service/AuthService", () => ({
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    registerInvited: vi.fn(),
}));

const admin: User = {
    id: "00000000-0000-4000-8000-000000000001",
    email: "admin@example.test",
    role: "ADMIN",
};
const school: User = {
    ...admin,
    email: "school@example.test",
    role: "SCHOOL_ADMIN",
    school_id: "00000000-0000-4000-8000-000000000002",
};

function SessionControls() {
    const session = useUserContext();
    return (
        <>
            <output data-testid="profile">{session.user?.role || "anonymous"}</output>
            <output data-testid="loading">{String(session.isLoading)}</output>
            <button onClick={() => void session.logoutUser()}>Sair da sessão</button>
            <button
                onClick={() =>
                    void session.registerInvitedUser({
                        invite_token: "test-invite",
                        email: school.email,
                        password: "TestOnly123!",
                    })
                }>
                Ativar convite
            </button>
        </>
    );
}

function mount(withLogin = true) {
    return render(
        <UserProvider>
            {withLogin && <Login />}
            <SessionControls />
        </UserProvider>
    );
}
async function waitUntilLoaded() {
    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));
}

beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    window.history.replaceState(null, "", "/login/");
    vi.mocked(me).mockRejectedValue(new Error("Não autenticado"));
});
afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
});

describe("tela de login e sessão", () => {
    it("campos vazios mostram validação sem enviar credenciais", async () => {
        mount();
        await waitUntilLoaded();
        await userEvent.click(screen.getByRole("button", { name: /Fazer Login/ }));
        expect(screen.getByText("O campo de email não deve estar vazio")).toBeTruthy();
        expect(screen.getByText("O campo da senha não deve estar vazio")).toBeTruthy();
        expect(login).not.toHaveBeenCalled();
    });
    it("credenciais inválidas exibem o aviso e mantêm a sessão encerrada", async () => {
        vi.mocked(login).mockRejectedValue(new Error("Invalid credentials"));
        mount();
        await waitUntilLoaded();
        await userEvent.type(screen.getByLabelText("Email"), admin.email);
        await userEvent.type(screen.getByLabelText("Senha"), "incorrect");
        await userEvent.click(screen.getByRole("button", { name: /Fazer Login/ }));
        await waitFor(() =>
            expect(toastError).toHaveBeenCalledWith(
                "Falha no login. Verifique suas credenciais."
            )
        );
        expect(
            screen.getByText("Falha no login. Verifique suas credenciais.")
        ).toBeTruthy();
        expect(screen.getByTestId("profile").textContent).toBe("anonymous");
        expect(router.replace).not.toHaveBeenCalled();
    });
    it.each([admin, school])(
        "login válido encaminha $role ao próprio console",
        async (user) => {
            mount();
            await waitUntilLoaded();
            vi.mocked(login).mockResolvedValue({});
            vi.mocked(me).mockResolvedValue(user);
            await userEvent.type(screen.getByLabelText("Email"), user.email);
            await userEvent.type(screen.getByLabelText("Senha"), "TestOnly123!");
            await userEvent.click(screen.getByRole("button", { name: /Fazer Login/ }));
            await waitFor(() =>
                expect(router.replace).toHaveBeenCalledWith(
                    user.role === "ADMIN" ? "/console/v2" : "/school/console"
                )
            );
            expect(screen.getByTestId("profile").textContent).toBe(user.role);
            expect(router.refresh).toHaveBeenCalled();
        }
    );
    it("login recupera destino autorizado com prefixo de produção", async () => {
        vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/ictite/v1/web");
        window.history.replaceState(
            null,
            "",
            "/ictite/v1/web/login/?redirect=%2Fictite%2Fv1%2Fweb%2Fconsole%2Fv2%2Fsubmissions%2F"
        );
        mount();
        await waitUntilLoaded();
        vi.mocked(login).mockResolvedValue({});
        vi.mocked(me).mockResolvedValue(admin);
        await userEvent.type(screen.getByLabelText("Email"), admin.email);
        await userEvent.type(screen.getByLabelText("Senha"), "TestOnly123!");
        await userEvent.click(screen.getByRole("button", { name: /Fazer Login/ }));
        await waitFor(() =>
            expect(router.replace).toHaveBeenCalledWith("/console/v2/submissions/")
        );
    });
    it("recupera sessão existente e logout remove o perfil", async () => {
        vi.mocked(me).mockResolvedValue(admin);
        vi.mocked(logout).mockResolvedValue(undefined);
        mount(false);
        await waitUntilLoaded();
        expect(screen.getByTestId("profile").textContent).toBe("ADMIN");
        await userEvent.click(screen.getByRole("button", { name: "Sair da sessão" }));
        await waitFor(() =>
            expect(screen.getByTestId("profile").textContent).toBe("anonymous")
        );
        expect(logout).toHaveBeenCalledTimes(1);
        expect(router.replace).toHaveBeenCalledWith("/login");
    });
    it("não restaura uma sessão antiga quando a resposta chega depois da expiração", async () => {
        let resolveMe!: (user: User) => void;
        vi.mocked(me).mockReturnValue(
            new Promise<User>((resolve) => {
                resolveMe = resolve;
            })
        );
        mount(false);
        act(() => window.dispatchEvent(new Event("ictite:session-expired")));
        await waitUntilLoaded();
        await act(async () => {
            resolveMe(admin);
        });
        expect(screen.getByTestId("profile").textContent).toBe("anonymous");
    });
    it("expiração durante uso remove o perfil ativo", async () => {
        vi.mocked(me).mockResolvedValue(school);
        mount(false);
        await waitUntilLoaded();
        act(() => window.dispatchEvent(new Event("ictite:session-expired")));
        expect(screen.getByTestId("profile").textContent).toBe("anonymous");
    });
    it("ativação por convite abre o console escolar", async () => {
        mount(false);
        await waitUntilLoaded();
        vi.mocked(registerInvited).mockResolvedValue({
            user: school,
            message: "Conta ativada",
        });
        vi.mocked(me).mockResolvedValue(school);
        await userEvent.click(screen.getByRole("button", { name: "Ativar convite" }));
        await waitFor(() =>
            expect(router.replace).toHaveBeenCalledWith("/school/console")
        );
        expect(registerInvited).toHaveBeenCalledWith(
            expect.objectContaining({ invite_token: "test-invite" })
        );
        expect(screen.getByTestId("profile").textContent).toBe("SCHOOL_ADMIN");
    });
});

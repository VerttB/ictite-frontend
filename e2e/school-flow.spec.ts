import { expect, test, type Page } from "@playwright/test";

const API = "http://localhost:8100";
const adminEmail = "admin1@admin.com";
const adminPassword = "E2e-Admin-Only-123!";
const schoolEmail = "school-e2e@example.test";
const schoolPassword = "E2e-School-Only-123!";
const schoolName = "Escola E2E descartável";

async function login(page: Page, email = adminEmail, password = adminPassword) {
    await page.goto("/login/");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole("button", { name: /Entrar|Fazer login/i }).click();
    await expect(page).toHaveURL(
        email === adminEmail ? /console\/v2/ : /school\/console/
    );
}

async function saveDraft(page: Page) {
    const saved = page.waitForResponse(
        (r) => r.url() === `${API}/submissions/current` && r.request().method() === "PUT"
    );
    await page.getByRole("button", { name: "Salvar Rascunho", exact: true }).click();
    expect((await saved).status()).toBe(200);
}

async function sendDraft(page: Page) {
    await page.getByRole("button", { name: "Escola", exact: true }).click();
    await page.getByRole("button", { name: "Revisar e enviar", exact: true }).click();
    await expect(
        page.getByRole("button", { name: "Enviar para análise", exact: true })
    ).toBeEnabled();
    const sent = page.waitForResponse((r) =>
        r.url().endsWith("/submissions/current/submit")
    );
    await page.getByRole("button", { name: "Enviar para análise", exact: true }).click();
    expect((await sent).status()).toBe(200);
    await expect(
        page.getByText("PENDENTE (Aguardando Aprovação)", { exact: true }).first()
    ).toBeVisible();
}

test("login inválido mostra aviso; sessão e perfis continuam protegidos", async ({
    page,
}) => {
    await page.goto("/console/v2/");
    await expect(page).toHaveURL(/login/);
    await page.locator('input[name="email"]').fill(adminEmail);
    await page.locator('input[name="password"]').fill("Senha-incorreta-123!");
    await page.getByRole("button", { name: /Entrar|Fazer login/i }).click();
    await expect(page.locator("[data-sonner-toast]")).toBeVisible();
    await expect(page).toHaveURL(/login/);
    await login(page);
    await page.goto("/school/console/");
    await expect(page).toHaveURL(/console\/v2/);
    await page.context().clearCookies();
    await page.goto("/console/v2/");
    await expect(page).toHaveURL(/login/);
});

test("admin cria escola e convite; escola salva, envia, corrige rejeição e publica", async ({
    browser,
}) => {
    test.setTimeout(300_000);
    const admin = await browser.newContext();
    const school = await browser.newContext();
    const adminPage = await admin.newPage();
    const page = await school.newPage();
    await login(adminPage);
    await adminPage.goto("/console/v2/escolas/");
    await adminPage.getByRole("button", { name: "Adicionar item" }).click();
    await adminPage.locator('input[name="name"]').fill(schoolName);
    await adminPage
        .getByLabel("Território de Identidade (Opcional)", { exact: true })
        .fill("Metropolitana");
    await adminPage
        .getByRole("option", { name: /26.*Metropolitana de Salvador/ })
        .click();
    const create = adminPage.waitForResponse(
        (r) => r.url() === `${API}/schools/` && r.request().method() === "POST"
    );
    await adminPage.getByRole("button", { name: "Criar", exact: true }).click();
    const created = await create;
    expect(created.status()).toBe(201);
    const schoolId = (await created.json()).id;
    await adminPage.getByRole("button", { name: "Gerar convite", exact: true }).click();
    await adminPage.getByRole("button", { name: "Gerar link", exact: true }).click();
    const invitation = await adminPage
        .getByRole("textbox", { name: "Link de convite" })
        .inputValue();
    await page.goto(invitation);
    await page.locator('input[name="email"]').fill(schoolEmail);
    await page.locator('input[name="password"]').fill(schoolPassword);
    await page.locator('input[name="confirmPassword"]').fill(schoolPassword);
    await page.getByRole("button", { name: "Ativar conta" }).click();
    await expect(page).toHaveURL(/school\/console/, { timeout: 60_000 });
    await expect(page.getByRole("heading", { name: "Console da Escola" })).toBeVisible();
    console.info("Escola criada pela interface; convite e ativação concluídos.");
    await page.getByRole("button", { name: "Escola", exact: true }).click();
    await expect(page.locator('input[name="school.name"]')).toHaveValue(schoolName);
    await page.locator('input[name="school.cep"]').fill("40000000");
    await expect(page.locator('input[name="school.cep"]')).toHaveValue("40000-000");
    await expect(page.locator('input[name="school.city"]')).toHaveValue("Salvador");
    await expect(page.getByLabel("Território de Identidade (Opcional)")).toContainText(
        "Metropolitana de Salvador"
    );
    await page.getByRole("button", { name: "Clubes de Ciência", exact: true }).click();
    await page.getByRole("button", { name: "Adicionar", exact: true }).click();
    await page.locator('input[name="clubs.0.name"]').fill("Clube E2E");
    await saveDraft(page);
    const png = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
        "base64"
    );
    const clubUpload = page.waitForResponse(
        (r) => r.request().method() === "POST" && r.url().includes("/images/")
    );
    await page.locator('input[type="file"]').setInputFiles([
        { name: "logo.png", mimeType: "image/png", buffer: png },
        { name: "galeria.png", mimeType: "image/png", buffer: png },
    ]);
    expect((await clubUpload).status()).toBe(200);
    await page.getByRole("button", { name: "Projetos", exact: true }).click();
    await page.getByRole("button", { name: "Adicionar", exact: true }).click();
    await page.locator('input[name="projects.0.name"]').fill("Projeto E2E sem anos");
    await page.locator('input[name="projects.0.start_year"]').fill("");
    await page.locator('input[name="projects.0.end_year"]').fill("");
    await page.getByRole("button", { name: "Adicionar", exact: true }).click();
    await page.locator('input[name="projects.1.name"]').fill("Segundo projeto E2E");
    await saveDraft(page);
    const projectUpload = page.waitForResponse(
        (r) => r.request().method() === "POST" && r.url().includes("/images/project/")
    );
    await page
        .locator('input[type="file"]')
        .first()
        .setInputFiles({ name: "projeto.png", mimeType: "image/png", buffer: png });
    expect((await projectUpload).status()).toBe(200);
    console.info("CEP/cidade/território, clube, dois projetos e uploads conferidos.");
    await page.getByRole("button", { name: "Pesquisadores", exact: true }).click();
    await page.getByRole("button", { name: "Adicionar", exact: true }).click();
    await page.locator('input[name="researchers.0.name"]').fill("Pesquisadora E2E");
    await page.getByLabel("Projeto E2E sem anos", { exact: true }).check();
    await page.getByLabel("Segundo projeto E2E", { exact: true }).check();
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    await expect(page.getByText(/foto do pesquisador é obtida automaticamente/)).toBeVisible();
    await page.getByRole("button", { name: "Equipamentos", exact: true }).click();
    await page.getByRole("button", { name: "Adicionar", exact: true }).click();
    await page.locator('input[name="equipments.0.name"]').fill("Microscópio E2E");
    await page.getByLabel("Tipo do Equipamento (Obrigatório)").click();
    await page.getByRole("option").first().click();
    await saveDraft(page);
    await page.reload();
    await page.getByRole("button", { name: "Projetos", exact: true }).click();
    await expect(page.locator('input[name="projects.0.start_year"]')).toHaveValue("");
    await expect(page.locator('input[name="projects.0.end_year"]')).toHaveValue("");
    await page.getByRole("button", { name: "Prévia do Portal", exact: true }).click();
    const previewImages = page.locator('img[src*="school-form"]');
    await expect(previewImages).toHaveCount(3);
    expect(
        new Set(
            await previewImages.evaluateAll((images) =>
                images.map((img) => (img as HTMLImageElement).src)
            )
        ).size
    ).toBe(3);
    console.info(
        "Rascunho recarregado; anos ausentes e três imagens distintas na prévia."
    );
    await sendDraft(page);
    await adminPage.goto("/console/v2/submissions/");
    const row = adminPage.getByRole("row").filter({ hasText: schoolName });
    await expect(row).toHaveCount(1);
    await expect(row).toContainText(schoolEmail);
    await row.getByRole("button", { name: "Ver detalhes" }).click();
    await adminPage.getByRole("button", { name: "Rejeitar", exact: true }).click();
    await adminPage
        .getByLabel("Motivo da rejeição")
        .fill("Corrigir a descrição da escola no teste E2E.");
    await adminPage.getByRole("button", { name: "Confirmar rejeição" }).click();
    await expect(
        adminPage.getByText("Submissão rejeitada com sucesso.", { exact: true })
    ).toBeVisible();
    console.info("Envio e rejeição administrativa concluídos pela interface.");
    await page.reload();
    await expect(
        page.getByText("Corrigir a descrição da escola no teste E2E.")
    ).toBeVisible();
    await page.getByRole("button", { name: "Escola", exact: true }).click();
    await page.getByRole("button", { name: "Reabrir Formulário", exact: true }).click();
    await page.getByRole("button", { name: "Escola", exact: true }).click();
    await page
        .locator('textarea[name="school.description"]')
        .fill("Descrição corrigida pela interface E2E.");
    await saveDraft(page);
    await sendDraft(page);
    await adminPage.reload();
    await row.getByRole("button", { name: "Ver detalhes" }).click();
    await adminPage.getByRole("button", { name: "Aprovar", exact: true }).click();
    await adminPage
        .getByRole("button", { name: "Confirmar aprovação", exact: true })
        .click();
    await expect(
        adminPage.getByText("Submissão aprovada com sucesso.", { exact: true })
    ).toBeVisible();
    console.info("Reabertura, reenvio e aprovação concluídos pela interface.");
    await page.reload();
    await expect(page.getByText("APROVADO", { exact: true }).first()).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
        await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(390);
    await page.screenshot({
        path: "test-results/formulario-mobile-aprovado.png",
        fullPage: true,
        animations: "disabled",
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    const published = await (
        await page.request.get(`${API}/schools/${schoolId}/projects`)
    ).json();
    expect(published).toHaveLength(2);
    expect(
        published.find((p: { name: string }) => p.name === "Projeto E2E sem anos")
    ).toMatchObject({ start_year: null, end_year: null });
    const researchers = await (
        await page.request.get(`${API}/schools/${schoolId}/researchers`)
    ).json();
    expect(JSON.stringify(researchers)).toContain("Pesquisadora E2E");
    const finalDraft = await (await page.request.get(`${API}/submissions/latest`)).json();
    expect(finalDraft.data.researchers).toHaveLength(1);
    expect(finalDraft.data.researchers[0].project_ids).toHaveLength(2);
    await page.goto(`/escolas/${schoolId}/`);
    await expect(page.getByText(schoolName).first()).toBeVisible();
    await admin.close();
    await school.close();
});

test("escolas, filtros e modal cabem em 390px nos dois temas", async ({ page }) => {
    await login(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/console/v2/escolas/");
    for (const theme of ["light", "dark"]) {
        const current = await page.locator("html").getAttribute("data-theme");
        if (current !== theme)
            await page.getByRole("button", { name: /Mudar para tema/ }).click();
        const width = await page.evaluate(() => ({
            viewport: innerWidth,
            document: document.documentElement.scrollWidth,
        }));
        expect(width.document).toBeLessThanOrEqual(width.viewport);
        await page.getByRole("button", { name: "Mais filtros" }).click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
        await expect(page.getByRole("button", { name: "Mais filtros" })).toBeFocused();
        await page.screenshot({
            path: `test-results/escolas-mobile-${theme}.png`,
            fullPage: true,
            animations: "disabled",
        });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({
        path: "test-results/escolas-desktop-dark.png",
        fullPage: true,
        animations: "disabled",
    });
    await page
        .getByRole("textbox", { name: "Buscar escolas" })
        .fill("busca-sem-resultados-e2e");
    await expect(page).toHaveURL(/name=busca-sem-resultados-e2e/);
    await expect(page.getByText("Total: 0", { exact: true })).toBeVisible();
    await page.getByRole("textbox", { name: "Buscar escolas" }).fill("");
    await expect(page).not.toHaveURL(/name=/);
    await page.getByRole("button", { name: "Mais filtros" }).click();
    await page
        .getByLabel("Território de Identidade", { exact: true })
        .fill("Metropolitana");
    await page
        .getByRole("option", { name: "Metropolitana de Salvador", exact: true })
        .click();
    await page.getByRole("button", { name: "Aplicar", exact: true }).click();
    await expect(page).toHaveURL(/identity_territory_id=/);
    await page.getByRole("button", { name: "Mais filtros" }).click();
    await page.getByRole("button", { name: "Limpar Filtros", exact: true }).click();
    await expect(page).not.toHaveURL(/identity_territory_id=/);
    await page.goto("/console/v2/submissions/");
    await page.getByRole("tab", { name: "Prorrogações", exact: true }).click();
    const deadlineInput = page.locator("#school-form-global-deadline");
    await expect(deadlineInput).toBeEnabled();
    await deadlineInput.fill("2099-01-01T12:00");
    const saveDeadline = page.waitForResponse(
        (r) =>
            r.url().endsWith("/admin/submissions/config/deadline") &&
            r.request().method() === "PUT"
    );
    await page.getByRole("button", { name: "Salvar prazo", exact: true }).click();
    expect((await saveDeadline).status()).toBe(200);
    await page.reload();
    await page.getByRole("tab", { name: "Prorrogações", exact: true }).click();
    await expect(deadlineInput).toHaveValue("2099-01-01T12:00");
    await page.getByRole("button", { name: "Remover prazo", exact: true }).click();
    await expect(deadlineInput).toHaveValue("");
    await page.goto("/escolas/");
    for (const theme of ["light", "dark"]) {
        if ((await page.locator("html").getAttribute("data-theme")) !== theme) {
            await page.getByRole("button", { name: /Mudar para tema/ }).click();
        }
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const contrast = await page
            .getByRole("link", { name: "Clubes de Ciência", exact: true })
            .evaluate(async (element) => {
                await Promise.all(element.getAnimations().map((animation) => animation.finished.catch(() => undefined)));
                const style = getComputedStyle(element);
                const luminance = (color: string) => {
                    const channels = color
                        .match(/[\d.]+/g)!
                        .slice(0, 3)
                        .map(Number)
                        .map((channel) => {
                            const value = channel / 255;
                            return value <= 0.04045
                                ? value / 12.92
                                : ((value + 0.055) / 1.055) ** 2.4;
                        });
                    return (
                        channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
                    );
                };
                // As cores semânticas do link resolvem para RGB no navegador.
                const canvas = document.createElement("canvas").getContext("2d")!;
                const rgb = (color: string) => {
                    canvas.fillStyle = color;
                    canvas.fillRect(0, 0, 1, 1);
                    return `rgb(${Array.from(canvas.getImageData(0, 0, 1, 1).data)
                        .slice(0, 3)
                        .join(",")})`;
                };
                const text = luminance(rgb(style.color));
                const background = luminance(rgb(style.backgroundColor));
                return (
                    (Math.max(text, background) + 0.05) /
                    (Math.min(text, background) + 0.05)
                );
            });
        expect(contrast).toBeGreaterThanOrEqual(4.5);
        await page.screenshot({
            path: `test-results/navegacao-publica-${theme}.png`,
            fullPage: true,
            animations: "disabled",
        });
        await page.setViewportSize({ width: 390, height: 844 });
        expect(
            await page.evaluate(() => document.documentElement.scrollWidth)
        ).toBeLessThanOrEqual(390);
        await page.setViewportSize({ width: 1440, height: 1000 });
    }
});

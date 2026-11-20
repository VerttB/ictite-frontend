export default async function teardown() {
    await fetch("http://localhost:8100/__e2e__/shutdown", { method: "POST" });
    // Espera a liberação do banco e da pasta de uploads antes de encerrar o processo.
    for (let attempt = 0; attempt < 50; attempt++) {
        try {
            await fetch("http://localhost:8100/openapi.json", {
                signal: AbortSignal.timeout(500),
            });
        } catch {
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
    throw new Error("A API temporária não encerrou; confira a limpeza do container E2E.");
}

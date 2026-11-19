import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    workers: 1,
    retries: 0,
    timeout: 120_000,
    expect: { timeout: 15_000 },
    globalTimeout: 15 * 60_000,
    globalTeardown: "./e2e/teardown.ts",
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
        baseURL: "http://localhost:3100",
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        actionTimeout: 20_000,
        navigationTimeout: 60_000,
    },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    webServer: [
        {
            name: "API descartável",
            command: "poetry run python tests/e2e_server.py",
            cwd:
                process.env.ICTITE_BACKEND_DIR ||
                path.resolve(__dirname, "../ictite-backend"),
            url: "http://localhost:8100/openapi.json",
            reuseExistingServer: false,
            timeout: 120_000,
        },
        {
            name: "Frontend E2E",
            command: "npx next dev --webpack --port 3100",
            url: "http://localhost:3100/login/",
            reuseExistingServer: false,
            timeout: 120_000,
            env: {
                NEXT_PUBLIC_BASE_URL: "http://localhost:8100",
                API_INTERNAL_URL: "http://localhost:8100",
                NEXT_PUBLIC_BASE_PATH: "",
                NEXT_DIST_DIR: ".next-e2e",
            },
        },
    ],
});

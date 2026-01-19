import { errorTypes } from "./types";

export function getErrorMessages(data: unknown, status: number): string {
    const getPossibleProp = (obj: unknown, prop: string) => {
        if (obj && typeof obj === "object" && prop in obj) {
            const value = (obj as Record<string, unknown>)[prop];
            if (typeof value === "string") return value;
            if (value !== null && value !== undefined) return JSON.stringify(value);
        }
    };

    return (
        getPossibleProp(data, "message") ||
        getPossibleProp(data, "detail") ||
        getPossibleProp(data, "error") ||
        errorTypes[status] ||
        `Erro HTTP ${status}`
    );
}

import { errorTypes } from "./types";

export function getErrorMessages(data: unknown, status: number): string {
    const formatDetailItem = (item: unknown) => {
        if (!item || typeof item !== "object") return String(item);
        const record = item as Record<string, unknown>;
        const field = Array.isArray(record.loc)
            ? record.loc.filter((part) => part !== "body").join(".")
            : undefined;
        const message = typeof record.msg === "string" ? record.msg : undefined;
        return [field, message].filter(Boolean).join(": ");
    };

    const getPossibleProp = (obj: unknown, prop: string) => {
        if (obj && typeof obj === "object" && prop in obj) {
            const value = (obj as Record<string, unknown>)[prop];
            if (typeof value === "string") return value;
            if (Array.isArray(value)) return value.map(formatDetailItem).join("\n");
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

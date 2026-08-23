import { errorTypes } from "./types";

function formatErrorValue(value: unknown): string | undefined {
    if (value === null || value === undefined) return undefined;
    if (typeof value === "string") return value;

    if (Array.isArray(value)) {
        const messages = value.map((item) => formatErrorValue(item)).filter(Boolean);
        return messages.length > 0 ? messages.join("\n") : undefined;
    }

    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if ("msg" in obj || "loc" in obj) {
            const field = Array.isArray(obj.loc)
                ? obj.loc
                      .filter(
                          (part) => part !== "body" && part !== "query" && part !== "path"
                      )
                      .join(".")
                : undefined;
            const message =
                typeof obj.msg === "string" ? obj.msg : formatErrorValue(obj.msg);
            return [field, message].filter(Boolean).join(": ");
        }

        if (typeof obj.message === "string") return obj.message;
        if (typeof obj.detail === "string") return obj.detail;
        if (typeof obj.error === "string") return obj.error;

        const entries = Object.entries(obj)
            .map(([key, val]) => {
                const formattedVal = formatErrorValue(val);
                if (!formattedVal) return undefined;
                return `${key}: ${formattedVal}`;
            })
            .filter(Boolean);

        if (entries.length > 0) {
            return entries.join("\n");
        }
    }

    return String(value);
}

export function getErrorMessages(data: unknown, status: number): string {
    const getPossibleProp = (obj: unknown, prop: string) => {
        if (obj && typeof obj === "object" && prop in obj) {
            const value = (obj as Record<string, unknown>)[prop];
            return formatErrorValue(value);
        }
    };

    return (
        getPossibleProp(data, "message") ||
        getPossibleProp(data, "detail") ||
        getPossibleProp(data, "error") ||
        formatErrorValue(data) ||
        errorTypes[status] ||
        `Erro HTTP ${status}`
    );
}

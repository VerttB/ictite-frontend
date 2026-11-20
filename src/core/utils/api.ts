export const getBaseUrl = (): string => {
    const url =
        typeof window === "undefined"
            ? process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_BASE_URL
            : process.env.NEXT_PUBLIC_BASE_URL;
    if (!url) {
        throw new Error("Configure NEXT_PUBLIC_BASE_URL para acessar a API.");
    }
    return url.replace(/\/$/, "");
};

export const getAssetPrefix = (): string => {
    if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
        return process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "");
    }
    const isProd = process.env.NODE_ENV === "production";
    return isProd ? "/ictite/v1/web" : "";
};

export const getBaseUrl = (): string => {
    if (typeof window === "undefined") {
        return process.env.NEXT_PUBLIC_BASE_URL!;
    }
    return "http://localhost:8000";
};

export const getAssetPrefix = (): string => {
    const isProd = process.env.NODE_ENV === "production";
    return isProd ? "/ictite/v1/web" : "";
};

export const getBaseUrl = (): string => {
    const isProd = process.env.NODE_ENV === "production";
    const url = isProd
        ? process.env.NEXT_PUBLIC_BASE_URL!
        : "http://localhost:8000";
    return url;
};

export const getAssetPrefix = (): string => {
    const isProd = process.env.NODE_ENV === "production";
    return isProd ? "/ictite/v1/web" : "";
};

import { getBaseUrl } from "@/core/utils/api";

const DEFAULT_TIMEOUT = 25000;

export interface ApiRequestOptions extends Omit<RequestInit, "body" | "method"> {
    timeout?: number;
    params?: { [key: string]: string | number | string[] | boolean | undefined | null };
}

export const apiDefaultConfig = {
    baseUrl: getBaseUrl() || "",
    timeout: DEFAULT_TIMEOUT,
};

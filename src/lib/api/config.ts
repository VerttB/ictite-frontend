import { SearchParams } from "@/core/interface/SearchParams";
import { getBaseUrl } from "@/core/utils/api";

const DEFAULT_TIMEOUT = 25000;

export interface ApiRequestOptions extends Omit<RequestInit, "body" | "method"> {
    timeout?: number;
    params?: SearchParams;
    expectNoContent?: boolean;
}

export const apiDefaultConfig = {
    baseUrl: getBaseUrl() || "",
    timeout: DEFAULT_TIMEOUT,
};

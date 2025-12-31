import { buildSearchParameters } from "@/core/utils/searchParamBuilder";
import { apiDefaultConfig, ApiRequestOptions } from "./config";
import { ApiError } from "./error";
import { errorTypes, RequestMethod } from "./types";

export class ApiClient {
    private baseUrl: string;
    private defaultTimeout: number;

    constructor(config: { baseUrl?: string; timeout?: number } = {}) {
        this.baseUrl = config.baseUrl || apiDefaultConfig.baseUrl;
        this.defaultTimeout = config.timeout || apiDefaultConfig.timeout;
    }

    private async handleResponse<T>(response: Response): Promise<T | null> {
        if (response.status === 204) return null;

        const data = await response.json().catch(() => ({}));

        if (response.ok) return data as T;

        const errorMessage =
            data.message ||
            data.detail ||
            errorTypes[response.status] ||
            `Erro HTTP ${response.status}`;

        throw new ApiError(errorMessage, response.status, response);
    }

    private isEndpointAbsolute(url: string): boolean {
        return /^(?:[a-z]+:)?\/\//i.test(url);
    }

    private buildUrl(endpoint: string, parsedParams?: string): string {
        let finalUrl = "";
        if (this.isEndpointAbsolute(endpoint)) {
            finalUrl = endpoint;
        } else {
            finalUrl = this.baseUrl + endpoint;
            if (this.baseUrl === "") {
                throw new Error(
                    "A url não foi definida no ApiClient e o endpoint fornecido não é absoluto."
                );
            }
        }

        const separator = finalUrl.includes("?") ? "&" : "?";
        return `${finalUrl}${parsedParams ? separator + parsedParams : ""}`;
    }
    private async request<T>(
        endpoint: string,
        method: RequestMethod,
        body?: any,
        options: ApiRequestOptions = {}
    ): Promise<T | null> {
        const {
            timeout = this.defaultTimeout,
            params,
            headers: customHeaders,
            ...fetchOptions
        } = options;

        let parsedParams = "";
        if (params) {
            parsedParams = buildSearchParameters(params);
        }
        let url = this.buildUrl(endpoint, parsedParams);

        const controller = new AbortController();
        const signalId = setTimeout(() => controller.abort(), timeout);

        const headers = new Headers(customHeaders);

        if (typeof window === "undefined") {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const token = cookieStore.get("access_token");
                if (token) {
                    headers.append("Cookie", `${token.name}=${token.value}`);
                }
            } catch (e) {}
        }

        let finalBody = body;
        if (method !== "GET" && body && !(body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
            finalBody = JSON.stringify(body);
        }

        try {
            const res = await fetch(url, {
                ...fetchOptions,
                method,
                headers,
                body: finalBody,
                credentials: "include",
                signal: controller.signal,
                cache: fetchOptions.cache || "no-store",
            });

            clearTimeout(signalId);
            return await this.handleResponse<T>(res);
        } catch (error: unknown) {
            clearTimeout(signalId);

            if (error instanceof ApiError) throw error;

            if ((error as any).name === "AbortError") {
                throw new ApiError("A requisição demorou muito (Timeout).", 408);
            }

            throw new ApiError((error as Error).message || "Erro de conexão", 0);
        }
    }

    public get<T>(endpoint: string, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "GET", undefined, options);
    }

    public post<T, K = any>(endpoint: string, body: K, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "POST", body, options);
    }

    public put<T, K = any>(endpoint: string, body: K, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "PUT", body, options);
    }

    public patch<T, K = any>(endpoint: string, body: K, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "PATCH", body, options);
    }

    public delete<T>(endpoint: string, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "DELETE", undefined, options);
    }
}

export const apiClient = new ApiClient();

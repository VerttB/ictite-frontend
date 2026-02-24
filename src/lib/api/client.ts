import { buildSearchParameters } from "@/core/utils/searchParamBuilder";
import { apiDefaultConfig, ApiRequestOptions } from "./config";
import { ApiError } from "./error";
import { RequestMethod } from "./types";
import { SearchParams } from "@/core/interface/SearchParams";
import { getErrorMessages } from "./helpers";

export class ApiClient {
    private baseUrl: string;
    private defaultTimeout: number;

    constructor(config: { baseUrl?: string; timeout?: number } = {}) {
        this.baseUrl = config.baseUrl || apiDefaultConfig.baseUrl;
        this.defaultTimeout = config.timeout || apiDefaultConfig.timeout;
    }

    private async handleResponse<T>(
        response: Response,
        expectNoContent: boolean
    ): Promise<T> {
        if (response.status === 204) {
            if (expectNoContent) {
                throw new ApiError("A api não retornou nenhuma resposta.", 204);
            }
            return null as T;
        }
        let data: unknown = {};
        const contentType = response.headers.get("Content-Type");
        try {
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else if (contentType && contentType.includes("text/")) {
                data = await response.text();
                try {
                    data = JSON.parse(data as string);
                } catch (_e) {
                    data = { message: data };
                }
            }
        } catch (_e) {}
        if (response.ok) return data as T;
        let errorObject: any = data;
        throw new ApiError(
            getErrorMessages(errorObject.error, response.status),
            response.status,
            response
        );
    }

    private isEndpointAbsolute(url: string): boolean {
        return /^(?:[a-z]+:)?\/\//i.test(url);
    }

    private buildUrl(endpoint: string, params?: SearchParams): string {
        let finalUrl = "";
        if (this.isEndpointAbsolute(endpoint)) {
            finalUrl = endpoint;
        } else {
            const cleanBase = this.baseUrl.replace(/\/$/, "");
            const cleanEndpoint = endpoint.replace(/^\//, "");
            if (cleanBase === "") {
                throw new Error(
                    "A url não foi definida no ApiClient e o endpoint fornecido não é absoluto."
                );
            }
            finalUrl = `${cleanBase}/${cleanEndpoint}`;
        }
        if (params) {
            const parsedParams = buildSearchParameters(params);
            const separator = finalUrl.includes("?") ? "&" : "?";
            return `${finalUrl}${parsedParams ? separator + parsedParams : ""}`;
        }
        return finalUrl;
    }
    private async request<T, K = unknown>(
        endpoint: string,
        method: RequestMethod,
        body?: K,
        options: ApiRequestOptions = {}
    ): Promise<T> {
        const {
            timeout = this.defaultTimeout,
            params,
            headers: customHeaders,
            expectNoContent = method !== "DELETE",
            ...fetchOptions
        } = options;

        const url = this.buildUrl(endpoint, params);

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
            } catch (e) {} //eslint-disable-line
        }

        let finalBody: BodyInit | null | undefined;
        if (method !== "GET") {
            if (body instanceof FormData) {
                finalBody = body;
            } else if (body !== undefined && body !== null) {
                headers.set("Content-Type", "application/json");
                finalBody = JSON.stringify(body);
            }
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
            return await this.handleResponse<T>(res, expectNoContent);
        } catch (error: unknown) {
            clearTimeout(signalId);

            if (error instanceof ApiError) throw error;

            if (error instanceof Error && error.name === "AbortError") {
                throw new ApiError("A requisição demorou muito (Timeout).", 408);
            }

            throw new ApiError((error as Error).message || "Erro de conexão", 0);
        }
    }

    public get<T>(endpoint: string, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "GET", undefined, options);
    }

    public post<T, K = unknown>(endpoint: string, body: K, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "POST", body, options);
    }

    public put<T, K = unknown>(endpoint: string, body: K, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "PUT", body, options);
    }

    public patch<T, K = unknown>(endpoint: string, body: K, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "PATCH", body, options);
    }

    public delete<T = void>(endpoint: string, options?: ApiRequestOptions) {
        return this.request<T>(endpoint, "DELETE", undefined, options);
    }
}

export const apiClient = new ApiClient();

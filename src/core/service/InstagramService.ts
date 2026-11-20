import { apiClient } from "@/lib/api/client";
import { InstagramPost, InstagramSearchParams } from "../domain/Instagram";

export const getInstagramPosts = async (
    params: InstagramSearchParams = {}
): Promise<InstagramPost[]> => {
    const data = await apiClient.get<InstagramPost[]>("/instagram/news", { params });
    return data || [];
};

export const syncInstagramPosts = async (): Promise<InstagramPost[]> => {
    return apiClient.post<InstagramPost[]>("/instagram/sync", {});
};

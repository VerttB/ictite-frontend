import { Video } from "../domain/Video";
import { apiClient } from "@/lib/api/client";

export const getVideos = async (): Promise<Required<Video>[]> => {
    const data = await apiClient.get<Required<Video>[]>("/video");
    return data || [];
};

export const createVideo = async (videoData: Omit<Video, "id">) => {
    return await apiClient.post("/video", videoData);
};

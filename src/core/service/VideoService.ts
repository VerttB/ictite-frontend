import { Video } from "../domain/Video";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getVideos = async (): Promise<Required<Video>[]> => {
    console.log("Base URL:", baseUrl);
    try {
        const response = await fetch(`${baseUrl}/material`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch materials");
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createVideo = async (videoData: Omit<Video, "id">) => {
    try {
        const response = await fetch(`${baseUrl}/video`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(videoData),
        });
        if (!response.ok) {
            throw new Error("Failed to create video");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

"use client";

import React from "react";
import { EntityConsole } from "./generic/EntityConsole";
import { VideoForm } from "./forms/VideoForm";
import {
    getVideos,
    createVideo,
    deleteVideo,
} from "@/core/service/VideoService";
import {
    Video,
    VideoFormSchema,
    VideoSearchParams,
} from "@/core/domain/Video";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";

interface VideoAdmProps {
    params: VideoSearchParams;
}

export const VideoAdm = ({ params }: VideoAdmProps) => {
    const handleCreate = async (data: any): Promise<Video> => {
        const { images, ...payload } = data;
        const video = await createVideo(payload) as unknown as Video; // Type compat
        // Note: Image upload for videos is not implemented via separate route yet.
        return video;
    };

    const config: AdminEntityConfig<Video, VideoCreate, Video, typeof VideoCreateSchema> = {
        title: "Vídeos",
        entityName: "videos",
        schema: VideoCreateSchema,
        defaultValues: { images: [] },
        renderForm: () => <VideoForm />,
        childTabs: [],
        fetchFn: getVideos,
        createFn: async (data) => {
            const video = await createVideo(data);
            return { ...video, _redirectToList: true } as any;
        },
        updateFn: async () => { throw new Error("Update not implemented for videos"); },
        deleteFn: deleteVideo,
    };

    return <EntityConsole config={config} params={params} />;
};

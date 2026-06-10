"use client";

import React from "react";
import { EntityConsole } from "./generic/EntityConsole";
import { MagazineForm } from "./forms/MagazineForm";
import {
    getRevistas,
    createRevista,
    updateRevista,
    deleteRevista,
    uploadMagazineImage,
} from "@/core/service/RevistaService";
import {
    Magazine,
    MagazineCreate,
    MagazineFormSchema,
    MagazineUpdate,
    MagazineSearchParams,
} from "@/core/domain/Magazine";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";

interface MagazineAdmProps {
    params: MagazineSearchParams;
}

export const MagazineAdm = ({ params }: MagazineAdmProps) => {
    const handleCreate = async (data: any): Promise<Magazine> => {
        const { images, ...payload } = data;
        const magazine = await createRevista(payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => form.append("images", img));
            await uploadMagazineImage(magazine.id, form);
        }
        return magazine;
    };

    const handleUpdate = async (id: string, data: any): Promise<Magazine> => {
        const { images, ...payload } = data;
        const magazine = await updateRevista(id, payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => form.append("images", img));
            await uploadMagazineImage(id, form, true);
        }
        return magazine;
    };

    const config: AdminEntityConfig<Magazine, any, any, typeof MagazineFormSchema> = {
        title: "Revistas",
        entityName: "magazines",
        schema: MagazineFormSchema,
        defaultValues: { images: [] },
        renderForm: () => <MagazineForm />,
        childTabs: [],
        fetchFn: getRevistas,
        createFn: async (data) => {
            const magazine = await handleCreate(data);
            return { ...magazine, _redirectToList: true } as any;
        },
        updateFn: handleUpdate,
        deleteFn: deleteRevista,
    };

    return <EntityConsole config={config} params={params} />;
};

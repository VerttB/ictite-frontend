"use client";

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
    MagazineFormSchema,
    MagazineSearchParams,
    MagazineUpdateFormSchema,
} from "@/core/domain/Magazine";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";
import z from "zod";

interface MagazineAdmProps {
    params: MagazineSearchParams;
}

export const MagazineAdm = ({ params }: MagazineAdmProps) => {
    const handleCreate = async (
        data: z.infer<typeof MagazineFormSchema>
    ): Promise<Magazine> => {
        const { images, ...payload } = data;
        const magazine = await createRevista(payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: File) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadMagazineImage(magazine.id, form);
            }
        }
        return magazine;
    };

    const handleUpdate = async (
        id: string,
        data: z.infer<typeof MagazineUpdateFormSchema>
    ): Promise<Magazine> => {
        const { images, ...payload } = data;
        const magazine = await updateRevista(id, payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: File) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadMagazineImage(id, form, true);
            }
        }
        return magazine;
    };

    const config: AdminEntityConfig<
        Magazine,
        z.infer<typeof MagazineFormSchema>,
        z.infer<typeof MagazineUpdateFormSchema>,
        typeof MagazineFormSchema
    > = {
        title: "Revistas",
        entityName: "magazines",
        schema: MagazineFormSchema,
        createSchema: MagazineFormSchema,
        updateSchema: MagazineUpdateFormSchema,
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

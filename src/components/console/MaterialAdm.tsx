"use client";

import React from "react";
import { EntityConsole } from "./generic/EntityConsole";
import { MaterialForm } from "./forms/MaterialForm";
import {
    getMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    uploadMaterialImages,
} from "@/core/service/MaterialService";
import {
    Material,
    MaterialCreate,
    MaterialFormSchema,
    MaterialUpdate,
    MaterialUpdateFormSchema,
    MaterialSearchParams,
} from "@/core/domain/Material";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";

interface MaterialAdmProps {
    params: MaterialSearchParams;
}

export const MaterialAdm = ({ params }: MaterialAdmProps) => {
    const handleCreate = async (data: any): Promise<Material> => {
        const { images, ...payload } = data;
        const material = await createMaterial(payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadMaterialImages(material.id, form);
            }
        }
        return material;
    };

    const handleUpdate = async (id: string, data: any): Promise<Material> => {
        const { images, ...payload } = data;
        const material = await updateMaterial(id, payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            
            if (form.has("images")) {
                await uploadMaterialImages(id, form, true);
            }
        }
        return material;
    };

    const config: AdminEntityConfig<
        Material,
        MaterialCreate,
        MaterialUpdate,
        typeof MaterialFormSchema
    > = {
        title: "Materiais",
        entityName: "materials",
        schema: MaterialFormSchema,
        createSchema: MaterialFormSchema,
        updateSchema: MaterialUpdateFormSchema,
        defaultValues: { images: [] },
        renderForm: () => <MaterialForm />,
        childTabs: [],
        fetchFn: getMaterials,
        createFn: async (data) => {
            const material = await handleCreate(data);
            return { ...material, _redirectToList: true } as any;
        },
        updateFn: handleUpdate,
        deleteFn: deleteMaterial,
    };

    return <EntityConsole config={config} params={params} />;
};

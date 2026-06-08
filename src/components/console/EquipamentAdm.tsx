"use client";

import React from "react";
import { EntityConsole } from "./generic/EntityConsole";
import { EquipmentForm } from "./forms/EquipmentForm";
import {
    getEquipaments,
    createEquipament,
    updateEquipament,
    deleteEquipament,
    uploadEquipamentImages,
} from "@/core/service/EquipamentoService";
import {
    Equipment,
    EquipmentCreate,
    EquipmentFormSchema,
    EquipmentUpdate,
    EquipmentSearchParams,
} from "@/core/domain/Equipment";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";

interface EquipamentAdmProps {
    params: EquipmentSearchParams;
}

export const EquipamentAdm = ({ params }: EquipamentAdmProps) => {
    const handleCreate = async (data: any): Promise<Equipment> => {
        const { images, ...payload } = data;
        const eq = await createEquipament(payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => form.append("images", img));
            await uploadEquipamentImages(eq.id, form);
        }
        return eq;
    };

    const handleUpdate = async (id: string, data: any): Promise<Equipment> => {
        const { images, ...payload } = data;
        const eq = await updateEquipament(id, payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => form.append("images", img));
            await uploadEquipamentImages(id, form, true);
        }
        return eq;
    };

    const config: AdminEntityConfig<
        Equipment,
        any,
        any,
        typeof EquipmentFormSchema
    > = {
        title: "Equipamentos",
        entityName: "equipment",
        schema: EquipmentFormSchema,
        defaultValues: { images: [] },
        renderForm: (props) => <EquipmentForm {...props} />,
        childTabs: [],
        fetchFn: getEquipaments,
        createFn: handleCreate,
        updateFn: handleUpdate,
        deleteFn: deleteEquipament,
    };

    return <EntityConsole config={config} params={params} />;
};

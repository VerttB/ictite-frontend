"use client";

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
    EquipmentFormSchema,
    EquipmentSearchParams,
    EquipmentUpdateFormSchema,
} from "@/core/domain/Equipment";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";
import z from "zod";

interface EquipamentAdmProps {
    params: EquipmentSearchParams;
}

export const EquipamentAdm = ({ params }: EquipamentAdmProps) => {
    const handleCreate = async (
        data: z.infer<typeof EquipmentFormSchema>
    ): Promise<Equipment> => {
        const { images, ...payload } = data;
        const eq = await createEquipament(payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: File) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadEquipamentImages(eq.id, form);
            }
        }
        return eq;
    };

    const handleUpdate = async (
        id: string,
        data: z.infer<typeof EquipmentUpdateFormSchema>
    ): Promise<Equipment> => {
        const { images, ...payload } = data;
        const eq = await updateEquipament(id, payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: File) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadEquipamentImages(id, form, true);
            }
        }
        return eq;
    };

    const config: AdminEntityConfig<
        Equipment,
        z.infer<typeof EquipmentFormSchema>,
        z.infer<typeof EquipmentUpdateFormSchema>,
        typeof EquipmentFormSchema
    > = {
        title: "Equipamentos",
        entityName: "equipment",
        schema: EquipmentFormSchema,
        createSchema: EquipmentFormSchema,
        updateSchema: EquipmentUpdateFormSchema,
        defaultValues: { images: [] },
        mapToFormValues: (item: any) => ({
            ...item,
            school_id: item.school?.id,
            type_equipment_id: item.type_equipment?.id,
        }),
        renderForm: (props) => <EquipmentForm {...props} />,
        childTabs: [],
        fetchFn: getEquipaments,
        createFn: async (data) => {
            const eq = await handleCreate(data);
            return { ...eq, _redirectToList: true } as any;
        },
        updateFn: handleUpdate,
        deleteFn: deleteEquipament,
    };

    return <EntityConsole config={config} params={params} />;
};

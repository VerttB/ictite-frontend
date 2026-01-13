"use client";
import { useState } from "react";
import { Section } from "../Section";
import { BookOpenCheck } from "lucide-react";
import useSWR from "swr";

import {
    createMaterial,
    getMaterials,
    uploadMaterialImages,
    updateMaterial,
    deleteMaterial,
} from "@/core/service/MaterialService";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../forms-input/ControlledImageInput";
import { InputField } from "../forms-input/InputField";
import {
    Material,
    MaterialCreateSchema,
    MaterialCreate,
    MaterialUpdate,
    MaterialUpdateSchema,
    MaterialSearchParams,
} from "@/core/domain/Material";
import { ControlledSelect } from "../forms-input/ControlledSelect";
import { MaterialType } from "@/core/constants/materialType";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { useAdmCrud } from "@/hooks/useAdmCrud";

interface MaterialAdmProps {
    params: MaterialSearchParams;
}
export const MaterialAdm = ({ params }: MaterialAdmProps) => {
    const { data: materials, mutate } = useSWR(["materials", params], ([, p]) =>
        getMaterials(p)
    );

    const crud = useAdmCrud<Material, MaterialCreate, MaterialUpdate>({
        mutate,
        deleteFn: deleteMaterial,
    });

    const handleCreate = async (data: MaterialCreate) => {
        console.log(data);
        const { id } = await createMaterial(data);
        const newMaterial = new FormData();
        data.images.forEach((file) => newMaterial.append("images", file));
        await uploadMaterialImages(id, newMaterial);
    };

    const handleUpdate = async (id: string, data: MaterialUpdate) => {
        await updateMaterial(id, data);
    };

    if (!materials) return null;
    return (
        <>
            <Section<Material>
                title="Materiais"
                items={materials.items}
                onAdd={crud.ui.openCreate}
                onUpdate={crud.ui.openEdit}
                onDelete={crud.ui.openDelete}
                icon={<BookOpenCheck />}
            />
            <BaseFormModal<typeof MaterialCreateSchema, MaterialCreate>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={(data) => crud.actions.create(data, handleCreate)}
                title="Adicionar Material"
                schema={MaterialCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome do Material" />
                <InputField name="description" label="Descrição" />
                <InputField name="link" label="Link" />
                <ControlledSelect
                    name="type"
                    label="Tipo"
                    options={Object.values(MaterialType)}
                />
                <ControlledImageUpload name="images" />
            </BaseFormModal>

            {crud.editingItem && (
                <BaseFormModal<typeof MaterialUpdateSchema, MaterialUpdate>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={(data) => crud.actions.update(data, handleUpdate)}
                    title="Atualizar Material"
                    schema={MaterialUpdateSchema}
                    props={{
                        defaultValues: {
                            name: crud.editingItem?.name,
                            description: crud.editingItem?.description,
                            link: crud.editingItem?.link,
                        },
                    }}>
                    <InputField name="name" label="Nome do Material" />
                    <InputField name="description" label="Descrição" />
                    <InputField name="link" label="Link" />
                </BaseFormModal>
            )}

            <DeleteConfirmationModal
                open={!!crud.deletingItem}
                onClose={crud.ui.closeDelete}
                onConfirm={crud.actions.delete}
                title={`Deseja excluir ${crud.deletingItem?.name}?`}
                description="Essa ação não pode ser desfeita."
            />
        </>
    );
};

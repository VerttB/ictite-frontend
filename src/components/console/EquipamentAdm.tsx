"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import {
    createEquipament,
    getEquipaments,
    uploadEquipamentImages,
    updateEquipament,
    deleteEquipament,
} from "@/core/service/EquipamentoService";
import { getEquipamentTypes } from "@/core/service/TipoEquipamentoService";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../forms-input/InputField";
import { ControlledSelect } from "../forms-input/ControlledSelect";
import { ControlledImageUpload } from "../forms-input/ControlledImageInput";
import {
    Equipment,
    EquipmentCreateSchema,
    EquipmentCreate,
    EquipmentUpdate,
    EquipmentUpdateSchema,
    EquipmentSearchParams,
} from "@/core/domain/Equipment";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { useAdmCrud } from "@/hooks/useAdmCrud";
interface EquipmentAdmProps {
    params?: EquipmentSearchParams;
}
export const EquipmentAdm = ({ params }: EquipmentAdmProps) => {
    const { data: equipamentos, mutate } = useSWR(["equipaments", params], ([, p]) =>
        getEquipaments(p)
    );

    const { data: escolas } = useSWR("escolas", () => getSchools());
    const { data: equipamentosTipos } = useSWR("equipaments-types", () =>
        getEquipamentTypes()
    );

    const crud = useAdmCrud<Equipment, EquipmentCreate, EquipmentUpdate>({
        mutate,
        deleteFn: deleteEquipament,
    });

    const handleCreate = async (data: EquipmentCreate) => {
        const { id } = await createEquipament(data);
        const form = new FormData();
        data.images.forEach((file) => form.append("images", file));
        await uploadEquipamentImages(id, form);
    };

    const handleUpdate = async (id: string, data: EquipmentUpdate) => {
        await updateEquipament(id, data);
    };

    if (!equipamentos || !equipamentosTipos || !escolas) return null;
    return (
        <>
            <Section<Equipment>
                title="Equipamentos"
                items={equipamentos.items}
                icon={null}
                onAdd={crud.ui.openCreate}
                onUpdate={crud.ui.openEdit}
                onDelete={crud.ui.openDelete}
            />

            <BaseFormModal<typeof EquipmentCreateSchema, EquipmentCreate>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={(data) => crud.actions.create(data, handleCreate)}
                title="Adicionar Equipamento"
                schema={EquipmentCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome do Equipamento" />
                <ControlledSelect
                    name="type_equipment_id"
                    label="Tipo de Equipamento"
                    options={equipamentosTipos}
                />
                <ControlledSelect
                    name="school_id"
                    label="Escola"
                    options={escolas.items}
                />
                <ControlledImageUpload name="images" />
            </BaseFormModal>

            {crud.editingItem && (
                <BaseFormModal<typeof EquipmentUpdateSchema, EquipmentUpdate>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={(data) => crud.actions.update(data, handleUpdate)}
                    title="Atualizar Equipamento"
                    schema={EquipmentUpdateSchema}
                    props={{
                        defaultValues: {
                            name: crud.editingItem?.name,
                        },
                    }}>
                    <InputField name="name" label="Nome do Equipamento" />
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

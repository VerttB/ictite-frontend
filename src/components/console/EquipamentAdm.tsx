"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { EquipmentType, EquipmentSchema } from "@/schemas/EquipmentSchema";
import {
    createEquipament,
    getEquipaments,
    uploadEquipamentImages,
} from "@/core/service/EquipamentoService";
import { getEquipamentTypes } from "@/core/service/TipoEquipamentoService";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../ui/FormInputField";
import { ControlledSelect } from "../ui/ControlledSelect";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import {
    EquipmentCreateSchema,
    EquipmentCreateType,
    EquipmentSearchParams,
} from "@/core/domain/Equipment";
interface EquipmentAdmProps {
    params?: EquipmentSearchParams;
}
export const EquipmentAdm = ({ params }: EquipmentAdmProps) => {
    const { data: equipamentos, mutate } = useSWR(
        ["equipaments", params],
        ([, p]) => getEquipaments(p)
    );

    const { data: escolas } = useSWR("escolas", () => getSchools());
    const { data: equipamentosTipos } = useSWR("equipaments-types", () =>
        getEquipamentTypes()
    );
    const [open, setOpen] = useState(false);
    const onSubmit = async (data: EquipmentCreateType) => {
        const { id } = await createEquipament(data);
        const form = new FormData();
        data.images.forEach((file) => form.append("images", file));
        await uploadEquipamentImages(id, form);
        mutate();
        setOpen(false);
    };

    if (!equipamentos || !equipamentosTipos || !escolas) return null;
    return (
        <>
            <Section
                title="Equipamentos"
                items={equipamentos}
                icon={null}
                onAdd={() => setOpen(true)}
            />

            <BaseFormModal<typeof EquipmentCreateSchema, EquipmentCreateType>
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
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
                    options={escolas}
                />
                <ControlledImageUpload name="images" />
            </BaseFormModal>
        </>
    );
};

"use client";
import { useState } from "react";
import { Section } from "../Section";
import { BookOpenCheck } from "lucide-react";
import useSWR from "swr";

import {
    createMaterial,
    getMaterials,
    uploadMaterialImages,
} from "@/core/service/MaterialService";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import { InputField } from "../ui/FormInputField";
import {
    MaterialCreateSchema,
    MaterialCreate,
    MaterialSearchParams,
} from "@/core/domain/Material";

interface MaterialAdmProps {
    params: MaterialSearchParams;
}
export const MaterialAdm = ({ params }: MaterialAdmProps) => {
    const { data: materials, mutate } = useSWR(["materials", params], ([, p]) =>
        getMaterials(p)
    );
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: MaterialCreate) => {
        const { id } = await createMaterial(data);
        const newMaterial = new FormData();
        data.images.forEach((file) => newMaterial.append("images", file));
        await uploadMaterialImages(id, newMaterial);
        mutate();
        setOpen(false);
    };

    if (!materials) return null;
    return (
        <>
            <Section
                title="Materiais"
                items={materials}
                onAdd={() => setOpen(true)}
                icon={<BookOpenCheck />}
            />
            <BaseFormModal<typeof MaterialCreateSchema, MaterialCreate>
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
                title="Adicionar Material"
                schema={MaterialCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome do Material" />
                <InputField name="description" label="Descrição" />
                <InputField name="link" label="Link" />
                <ControlledImageUpload name="images" />
            </BaseFormModal>
        </>
    );
};

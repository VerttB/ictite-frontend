"use client";
import { useState } from "react";
import { Section } from "../Section";
import {
    createRevista,
    getRevistas,
    uploadMagazineImage,
} from "@/core/service/RevistaService";
import { Book } from "lucide-react";
import useSWR from "swr";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../ui/FormInputField";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import {
    MagazineCreate,
    MagazineCreateSchema,
    MagazineSearchParams,
} from "@/core/domain/Magazine";

interface MagazineAdmProps {
    params?: MagazineSearchParams;
}
export const MagazineAdm = ({ params }: MagazineAdmProps) => {
    const { data: revistas, mutate } = useSWR(["magazines", params], ([, p]) =>
        getRevistas(p)
    );
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: MagazineCreate) => {
        const { id } = await createRevista(data);
        const form = new FormData();
        for (const file of data.images) {
            form.append("images", file);
        }
        await uploadMagazineImage(id, form);
        mutate();
        setOpen(false);
    };
    return (
        <>
            <Section
                title="Revistas"
                items={revistas || []}
                onAdd={() => setOpen(true)}
                icon={<Book />}
            />
            <BaseFormModal<typeof MagazineCreateSchema, MagazineCreate>
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
                schema={MagazineCreateSchema}
                title="Adicionar Revista"
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Título da Revista" />
                <InputField name="description" label="Descrição" />
                <InputField name="link" label="Link da Revista" />
                <ControlledImageUpload name="images" />
            </BaseFormModal>
        </>
    );
};

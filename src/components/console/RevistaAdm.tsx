"use client";
import { useState } from "react";
import { Section } from "../Section";
import { RevistaSchema, RevistaType } from "@/schemas/RevistaSchema";
import { createRevista, getRevistas } from "@/core/service/RevistaService";
import { Book } from "lucide-react";
import useSWR from "swr";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../ui/FormInputField";
import { ControlledImageUpload } from "../ui/ControlledImageInput";

export const RevistaAdm = () => {
    const {
        data: revistas,
        isLoading,
        mutate,
    } = useSWR("revistas", getRevistas);
    const [open, setOpen] = useState(false);

    const onSubmit = async (newRevista: RevistaType) => {
        const form = new FormData();
        form.append("title", newRevista.title);
        form.append("description", newRevista.description);
        form.append("link", newRevista.link);
        for (const file of newRevista.images) {
            form.append("images", file);
        }
        await createRevista(form);
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
            <BaseFormModal<typeof RevistaSchema, RevistaType>
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
                schema={RevistaSchema}
                title="Adicionar Revista"
                props={{ defaultValues: { images: [] } }}>
                <InputField name="title" label="Título da Revista" />
                <InputField name="description" label="Descrição" />
                <InputField name="link" label="Link da Revista" />
                <ControlledImageUpload name="images" />
            </BaseFormModal>
        </>
    );
};

"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { createSchool, getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { EscolaSchema, EscolaType } from "@/schemas/EscolaSchema";
import { School } from "lucide-react";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import { InputField } from "../ui/FormInputField";
import { mask } from "@/lib/maskBuilder";

export const EscolaAdm = () => {
    const { data: escolas, mutate } = useSWR("escolas", () => getSchools());
    const [open, setOpen] = useState(false);
    const onSubmit = async (data: EscolaType) => {
        const form = new FormData();
        form.append("name", data.name);
        form.append("description", data.description);
        form.append("cep", data.cep);
        data.images.forEach((file) => form.append("images", file));

        await createSchool(form);
        mutate();
        setOpen(false);
    };

    if (!escolas) return null;
    return (
        <>
            <Section
                title="Escolas"
                items={escolas}
                icon={<School />}
                onAdd={() => setOpen(true)}
            />

            <BaseFormModal<typeof EscolaSchema, EscolaType>
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
                title="Adicionar Escola"
                schema={EscolaSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome da Escola" />
                <InputField name="description" label="Descrição" />
                <InputField name="cep" label="CEP" mask={mask.cep} />

                <ControlledImageUpload name="images" />
            </BaseFormModal>
        </>
    );
};

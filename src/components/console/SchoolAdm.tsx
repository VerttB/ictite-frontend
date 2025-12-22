"use client";

import { Section } from "../Section";
import useSWR from "swr";
import {
    createSchool,
    getSchools,
    uploadSchoolImage,
} from "@/core/service/SchoolService";
import { useState } from "react";
import { School2 } from "lucide-react";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import { InputField } from "../ui/FormInputField";
import { mask } from "@/lib/maskBuilder";
import { SchoolSearchParams } from "@/core/domain/School";
import { SchoolCreate, SchoolCreateSchema } from "@/core/domain/School";
interface SchoolAdmProps {
    params: SchoolSearchParams;
}

export const SchoolAdm = ({ params }: SchoolAdmProps) => {
    const { data: schools, mutate } = useSWR(
        ["schools", params],
        ([, p]) => getSchools(p),
        {
            keepPreviousData: true,
        }
    );
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: SchoolCreate) => {
        console.log(data);
        const { id } = await createSchool(data);
        const form = new FormData();
        data.images.forEach((image) => {
            form.append("images", image);
        });
        await uploadSchoolImage(id, form);
        mutate();
        setOpen(false);
    };

    if (!schools) return null;
    return (
        <>
            <Section
                title="Escolas"
                items={schools}
                icon={<School2 />}
                onAdd={() => setOpen(true)}
            />

            <BaseFormModal<typeof SchoolCreateSchema, SchoolCreate>
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
                title="Adicionar Escola"
                schema={SchoolCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome da Escola" />
                <InputField name="description" label="Descrição" />
                <InputField name="cep" label="CEP" mask={mask.cep} />

                <ControlledImageUpload name="images" />
            </BaseFormModal>
        </>
    );
};

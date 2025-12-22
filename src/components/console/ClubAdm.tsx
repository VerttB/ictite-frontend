"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import {
    getClubesCiencia,
    createClubeCiencias,
    uploadClubImage,
} from "@/core/service/ClubeCienciaService";
import { useState } from "react";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import { InputField } from "../ui/FormInputField";
import { ControlledSelect } from "../ui/ControlledSelect";
import {
    ScienceClubCreate,
    ScienceClubCreateSchema,
    ScienceClubSearchParams,
} from "@/core/domain/Club";

interface ClubAdmProps {
    params?: ScienceClubSearchParams;
}

export const ClubAdm = ({ params }: ClubAdmProps) => {
    const { data: clubes, mutate } = useSWR(["clubes", params], ([, p]) =>
        getClubesCiencia(p)
    );

    const { data: escolas } = useSWR("escolas", () => getSchools());
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: ScienceClubCreate) => {
        const { id } = await createClubeCiencias(data);
        const form = new FormData();
        data.images.forEach((file) => form.append("images", file));
        await uploadClubImage(id, form);
        mutate();
        setOpen(false);
    };

    if (!clubes) return null;
    return (
        <>
            <Section
                title="Clubes de Ciências"
                items={clubes}
                icon={null}
                onAdd={() => setOpen(true)}
            />

            <BaseFormModal<typeof ScienceClubCreateSchema, ScienceClubCreate>
                open={open}
                onClose={() => setOpen(false)}
                title="Adicionar Clube de Ciências"
                schema={ScienceClubCreateSchema}
                props={{ defaultValues: { images: [] } }}
                onSubmit={onSubmit}>
                <InputField name="name" label="Nome do Clube de Ciências" />
                <InputField name="description" label="Descrição" />
                <ControlledSelect
                    className="w-full"
                    name="school_id"
                    label="Escola"
                    options={escolas || []}
                />
                <ControlledImageUpload name="images" />
            </BaseFormModal>
        </>
    );
};

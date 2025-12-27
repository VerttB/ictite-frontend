"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { useState } from "react";
import {
    getProjects,
    createProject,
    uploadProjectImages,
} from "@/core/service/ProjetoService";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../ui/FormInputField";
import { ControlledSelect } from "../ui/ControlledSelect";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import {
    ProjectCreate,
    ProjectCreateSchema,
    ProjectSearchParams,
} from "@/core/domain/Project";
import { getClubesCiencia } from "@/core/service/ClubeCienciaService";

interface ProjectAdmProps {
    params?: ProjectSearchParams;
}
export const ProjectAdm = ({ params }: ProjectAdmProps) => {
    const { data: projetos, mutate } = useSWR(["projetos", params], ([, p]) =>
        getProjects(p)
    );

    const { data: clubes } = useSWR("clubes", () => getClubesCiencia());
    const [open, setOpen] = useState(false);
    const onSubmit = async (data: ProjectCreate) => {
        const { id } = await createProject(data);
        const form = new FormData();
        if (data.images) {
            data.images.forEach((file) => form.append("images", file));
            await uploadProjectImages(id, form);
        }
        mutate();
        setOpen(false);
    };

    if (!projetos) return null;
    return (
        <>
            <Section
                title="Projetos"
                items={projetos}
                icon={null}
                onAdd={() => setOpen(true)}
            />

            <BaseFormModal<typeof ProjectCreateSchema, ProjectCreate>
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
                title="Adicionar Projeto"
                schema={ProjectCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome do Projeto" />
                <InputField name="description" label="Descrição" />
                <ControlledSelect
                    className="w-full"
                    name="clube_ciencia_id"
                    label="Clube"
                    options={clubes || []}
                />
                <ControlledImageUpload name="images" />
            </BaseFormModal>
        </>
    );
};

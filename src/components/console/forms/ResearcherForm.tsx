"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { InputField } from "../../forms-input/InputField";
import { ControlledComboBox } from "../../forms-input/ControlledComboBox";
import { ControlledSelect } from "../../forms-input/ControlledSelect";
import { ResearcherTypes } from "@/core/constants/researcherType";
import { GenderTypes } from "@/core/constants/sex";
import { RaceTypes } from "@/core/constants/race";
import useSWR from "swr";
import { getProjects, getProjectById } from "@/core/service/ProjetoService";
import { AdminFormProps } from "@/core/interface/AdminEntity";
import { getResearcherProjects } from "@/core/service/PesquisadorService";

export const ResearcherForm = ({ parentId, parentIdField }: AdminFormProps) => {
    const isProjectLocked = parentIdField === "projects_ids" && !!parentId;
    const { watch, setValue, formState: { dirtyFields } } = useFormContext();
    const researcherId = watch("id") as string | undefined;

    const { data: projects } = useSWR("projects-all", () => getProjects({ size: 0 }));
    const { data: parentProject } = useSWR(
        isProjectLocked ? ["project", parentId] : null,
        () => getProjectById(parentId!)
    );
    const { data: linkedProjects } = useSWR(
        researcherId ? ["researcher-projects-form", researcherId] : null,
        () => getResearcherProjects(researcherId!)
    );

    useEffect(() => {
        if (linkedProjects && !dirtyFields.projects_ids) {
            setValue("projects_ids", linkedProjects.map((project) => project.id));
        }
    }, [linkedProjects, dirtyFields.projects_ids, setValue]);

    const projectOptions =
        isProjectLocked && parentProject ? [parentProject] : projects?.items || [];

    return (
        <>
            <InputField name="name" label="Nome do Pesquisador" />
            <div className="grid grid-cols-2 gap-4">
                <InputField name="lattes_id" label="ID Lattes (16 dígitos)" />
                <ControlledSelect
                    name="type"
                    label="Tipo de Pesquisador"
                    options={Object.values(ResearcherTypes).map((t) => ({
                        id: t,
                        name: t,
                    }))}
                />
                <ControlledSelect
                    name="gender"
                    label="Gênero"
                    options={Object.values(GenderTypes).map((t) => ({ id: t, name: t }))}
                />
                <ControlledSelect
                    name="race"
                    label="Raça/Cor"
                    options={Object.values(RaceTypes).map((t) => ({ id: t, name: t }))}
                />
            </div>
            <ControlledComboBox
                className="w-full"
                name="projects_ids"
                label="Projetos (Obrigatório)"
                isMulti={true}
                truncateLabels={true}
                options={projectOptions}
                disabled={isProjectLocked}
                lockedValue={
                    isProjectLocked && parentProject
                        ? {
                              value: parentProject.id.toString(),
                              label: parentProject.name,
                          }
                        : null
                }
            />
        </>
    );
};

"use client";

import React from "react";
import { EntityConsole } from "./generic/EntityConsole";
import { ClubForm } from "./forms/ClubForm";
import {
    getClubesCiencia,
    createClubeCiencias,
    updateClubeCiencias,
    deleteClubeCiencias,
    uploadClubImage,
    getClubeCienciaProjects,
} from "@/core/service/ClubeCienciaService";
import {
    ScienceClub,
    ScienceClubCreate,
    ScienceClubFormSchema,
    ScienceClubUpdate,
    ScienceClubSearchParams,
} from "@/core/domain/Club";
import { AdminEntityConfig, ChildTabConfig } from "@/core/interface/AdminEntity";
import { NestedEntityList } from "./generic/NestedEntityList";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    uploadProjectImages,
    getProjectbyClube,
} from "@/core/service/ProjetoService";
import { ProjectFormSchema } from "@/core/domain/Project";
import { ProjectForm } from "./forms/ProjectForm";

interface ClubAdmProps {
    params: ScienceClubSearchParams;
}

export const ClubAdm = ({ params }: ClubAdmProps) => {
    const handleCreate = async (data: any): Promise<ScienceClub> => {
        const { images, ...payload } = data;
        const club = await createClubeCiencias(payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => form.append("images", img));
            await uploadClubImage(club.id, form);
        }
        return club;
    };

    const handleUpdate = async (id: string, data: any): Promise<ScienceClub> => {
        const { images, ...payload } = data;
        const club = await updateClubeCiencias(id, payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => form.append("images", img));
            await uploadClubImage(id, form, true);
        }
        return club;
    };

    const childTabs: ChildTabConfig[] = [
        {
            id: "projetos",
            label: "Projetos",
            entityName: "projetos",
            parentIdField: "clube_ciencia_id",
            renderList: (parentId) => (
                <NestedEntityList
                    title="Projetos"
                    entityName="projetos"
                    parentId={parentId}
                    parentIdField="clube_ciencia_id"
                    fetchFn={(params) => getClubeCienciaProjects(params.clube_ciencia_id)}
                    createFn={async (data: any) => {
                        const { images, ...payload } = data;
                        const project = await createProject(payload);
                        if (images?.length) {
                            const form = new FormData();
                            images.forEach((img: any) => form.append("images", img));
                            await uploadProjectImages(project.id, form);
                        }
                        return project;
                    }}
                    updateFn={async (id, data: any) => {
                        const { images, ...payload } = data;
                        const project = await updateProject(id, payload);
                        if (images?.length) {
                            const form = new FormData();
                            images.forEach((file: any) => form.append("images", file));
                            await uploadProjectImages(id, form, true);
                        }
                        return project;
                    }}
                    deleteFn={deleteProject}
                    schema={ProjectFormSchema}
                    defaultValues={{ images: [] }}
                    mapToFormValues={(item: any) => ({
                        ...item,
                        clube_ciencia_id: item.clube?.id,
                    })}
                    renderFields={(props) => <ProjectForm {...props} />}
                />
            ),
        },
    ];

    const config: AdminEntityConfig<ScienceClub, any, any, typeof ScienceClubFormSchema> =
        {
            title: "Clubes de Ciências",
            entityName: "clubes",
            schema: ScienceClubFormSchema,
            defaultValues: { images: [] },
            mapToFormValues: (item: any) => ({
                ...item,
                school_id: item.school?.id,
                coordinators_ids: item.coordinators?.map((c: any) => c.id) || [],
            }),
            renderForm: (props) => <ClubForm {...props} />,
            childTabs,
            fetchFn: getClubesCiencia,
            createFn: handleCreate,
            updateFn: handleUpdate,
            deleteFn: deleteClubeCiencias,
        };

    return <EntityConsole config={config} params={params} />;
};

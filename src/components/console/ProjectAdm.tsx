"use client";

import React from "react";
import { EntityConsole } from "./generic/EntityConsole";
import { ProjectForm } from "./forms/ProjectForm";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    uploadProjectImages,
} from "@/core/service/ProjetoService";
import {
    Project,
    ProjectCreate,
    ProjectFormSchema,
    ProjectUpdate,
    ProjectSearchParams,
} from "@/core/domain/Project";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";
import { ProjectMembersList } from "./ProjectMembersList";

interface ProjectAdmProps {
    params: ProjectSearchParams;
}

export const ProjectAdm = ({ params }: ProjectAdmProps) => {
    const handleCreate = async (data: any): Promise<Project> => {
        const { images, ...payload } = data;
        const project = await createProject(payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadProjectImages(project.id, form);
            }
        }
        return project;
    };

    const handleUpdate = async (id: string, data: any): Promise<Project> => {
        const { images, ...payload } = data;
        const project = await updateProject(id, payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadProjectImages(id, form, true);
            }
        }
        return project;
    };

    const config: AdminEntityConfig<Project, any, any, typeof ProjectFormSchema> = {
        title: "Projetos",
        entityName: "projects",
        schema: ProjectFormSchema,
        createSchema: ProjectFormSchema,
        updateSchema: ProjectUpdateFormSchema,
        defaultValues: { images: [] },
        mapToFormValues: (item: any) => ({
            ...item,
            clube_ciencia_id: item.clube?.id,
        }),
        renderForm: (props) => <ProjectForm {...props} />,
        childTabs: [
            {
                id: "pesquisadores",
                label: "Pesquisadores",
                entityName: "researchers",
                parentIdField: "project_id",
                renderList: (parentId) => <ProjectMembersList projectId={parentId} />,
            },
        ],
        fetchFn: getProjects,
        createFn: handleCreate,
        updateFn: handleUpdate,
        deleteFn: deleteProject,
    };

    return <EntityConsole config={config} params={params} />;
};

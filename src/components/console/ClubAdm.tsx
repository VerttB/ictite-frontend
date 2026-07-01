"use client";

import { EntityConsole } from "./generic/EntityConsole";
import { ClubForm } from "./forms/ClubForm";
import {
    getClubesCiencia,
    createClubeCiencias,
    updateClubeCiencias,
    deleteClubeCiencias,
    uploadClubImage,
    getClubeCienciaProjects,
    getClubeCienciaById,
} from "@/core/service/ClubeCienciaService";
import {
    ScienceClub,
    ScienceClubFormSchema,
    ScienceClubSearchParams,
    ScienceClubUpdateFormSchema,
} from "@/core/domain/Club";
import { AdminEntityConfig, ChildTabConfig } from "@/core/interface/AdminEntity";
import { NestedEntityList } from "./generic/NestedEntityList";
import {
    createProject,
    updateProject,
    deleteProject,
    uploadProjectImages,
    getProjectById,
} from "@/core/service/ProjetoService";
import { ProjectFormSchema, ProjectUpdateFormSchema } from "@/core/domain/Project";
import { ProjectForm } from "./forms/ProjectForm";
import z from "zod";
import { createCoordinator, deleteCoordinator, getCoordinators, updateCoordinator } from "@/core/service/CoordinatorService";
import { CoordinatorCreateSchema, CoordinatorSchema, CoordinatorUpdateSchema } from "@/core/domain/Coordinator";
import { CoordinatorForm } from "./forms/CoordinatorForm";

interface ClubAdmProps {
    params: ScienceClubSearchParams;
}

export const ClubAdm = ({ params }: ClubAdmProps) => {
    const handleCreate = async (
        data: z.infer<typeof ScienceClubFormSchema>
    ): Promise<ScienceClub> => {
        const { images, ...payload } = data;
        const club = await createClubeCiencias(payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadClubImage(club.id, form);
                return await getClubeCienciaById(club.id);
            }
        }
        return club;
    };

    const handleUpdate = async (
        id: string,
        data: z.infer<typeof ScienceClubUpdateFormSchema>
    ): Promise<ScienceClub> => {
        const { images, ...payload } = data;
        const club = await updateClubeCiencias(id, payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadClubImage(id, form, true);
                return await getClubeCienciaById(id);
            }
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
                    createFn={async (data: z.infer<typeof ProjectFormSchema>) => {
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
                                return await getProjectById(project.id);
                            }
                        }
                        return project;
                    }}
                    updateFn={async (
                        id,
                        data: z.infer<typeof ProjectUpdateFormSchema>
                    ) => {
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
                                return await getProjectById(id);
                            }
                        }
                        return project;
                    }}
                    deleteFn={deleteProject}
                    schema={ProjectFormSchema}
                    createSchema={ProjectFormSchema}
                    updateSchema={ProjectUpdateFormSchema}
                    defaultValues={{ images: [] }}
                    mapToFormValues={(item: any) => ({
                        ...item,
                        clube_ciencia_id: item.clube?.id,
                    })}
                    renderFields={(props) => <ProjectForm {...props} />}
                />
            ),
        },
        {
            id: "Coordenadores",
            label: "Coordenadores",
            entityName: "coordinators",
            parentIdField: "clube_id",
            renderList: (parentId) => (
                <NestedEntityList
                    title="Coordenadores"
                    entityName="coordinators"
                    parentId={parentId}
                    parentIdField="clube_id"
                    fetchFn={(params) => getCoordinators({ clube_id: params.clube_id })}
                    createFn={async (data) => {
                        return await createCoordinator({ ...data, clube_id: parentId });
                    }}
                    updateFn={async (id, data) => {
                        return await updateCoordinator(id, data);
                    }}
                    deleteFn={deleteCoordinator}
                    schema={CoordinatorSchema}
                    createSchema={CoordinatorCreateSchema} 
                    updateSchema={CoordinatorUpdateSchema}
                    defaultValues={{ researcher_id: "", clube_id: parentId }}
                    mapToFormValues={(item: any) => ({
                        clube_id: item.clube_id,
                        researcher_id: item.researcher_id,
                    })}
                    renderFields={(props) => <CoordinatorForm {...props} parentId={parentId} />}
                />
            )
        },
    ];

    const config: AdminEntityConfig<
        ScienceClub,
        z.infer<typeof ScienceClubFormSchema>,
        z.infer<typeof ScienceClubUpdateFormSchema>,
        typeof ScienceClubFormSchema,
        typeof ScienceClubUpdateFormSchema
    > = {
        title: "Clubes de Ciências",
        entityName: "clubes",
        createSchema: ScienceClubFormSchema,
        updateSchema: ScienceClubUpdateFormSchema,
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

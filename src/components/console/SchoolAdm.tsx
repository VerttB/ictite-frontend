"use client";

import React from "react";
import { EntityConsole } from "./generic/EntityConsole";
import { SchoolForm } from "./forms/SchoolForm";
import {
    createSchool,
    deleteSchool,
    getSchools,
    updateSchool,
    uploadSchoolImage,
    getSchoolClubs,
    getSchoolEquiments,
    getSchoolById,
} from "@/core/service/SchoolService";
import {
    School,
    SchoolFormSchema,
    SchoolUpdateFormSchema,
    SchoolSearchParams,
} from "@/core/domain/School";
import { AdminEntityConfig, ChildTabConfig } from "@/core/interface/AdminEntity";
import { NestedEntityList } from "./generic/NestedEntityList";
import {
    createClubeCiencias,
    updateClubeCiencias,
    deleteClubeCiencias,
    uploadClubImage,
    getClubeCienciaById,
} from "@/core/service/ClubeCienciaService";
import {
    createEquipament,
    updateEquipament,
    deleteEquipament,
    uploadEquipamentImages,
    getEquipamentById,
} from "@/core/service/EquipamentoService";
import { ScienceClubFormSchema, ScienceClubUpdateFormSchema } from "@/core/domain/Club";
import { EquipmentFormSchema, EquipmentUpdateFormSchema } from "@/core/domain/Equipment";
import { ClubForm } from "./forms/ClubForm";
import { EquipmentForm } from "./forms/EquipmentForm";
import z from "zod";

interface SchoolAdmProps {
    params: SchoolSearchParams;
}

export const SchoolAdm = ({ params }: SchoolAdmProps) => {
    const handleCreate = async (
        data: z.infer<typeof SchoolFormSchema>
    ): Promise<School> => {
        const { images, ...payload } = data;
        const school = await createSchool(payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadSchoolImage(school.id, form);
                return await getSchoolById(school.id);
            }
        }
        return school;
    };

    const handleUpdate = async (
        id: string,
        data: z.infer<typeof SchoolUpdateFormSchema>
    ): Promise<School> => {
        const { images, ...payload } = data;
        const school = await updateSchool(id, payload);
        if (images?.length) {
            const form = new FormData();
            images.forEach((img: any) => {
                if (img instanceof File) {
                    form.append("images", img);
                }
            });
            if (form.has("images")) {
                await uploadSchoolImage(id, form, true);
                return await getSchoolById(id);
            }
        }
        return school;
    };

    const childTabs: ChildTabConfig[] = [
        {
            id: "clubes",
            label: "Clubes de Ciências",
            entityName: "clubes",
            parentIdField: "school_id",
            renderList: (parentId) => (
                <NestedEntityList
                    title="Clubes de Ciências"
                    entityName="clubes"
                    parentId={parentId}
                    parentIdField="school_id"
                    fetchFn={(params) => getSchoolClubs(params.school_id)}
                    createFn={async (data: z.infer<typeof ScienceClubFormSchema>) => {
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
                    }}
                    updateFn={async (
                        id,
                        data: z.infer<typeof ScienceClubUpdateFormSchema>
                    ) => {
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
                    }}
                    deleteFn={deleteClubeCiencias}
                    schema={ScienceClubFormSchema}
                    createSchema={ScienceClubFormSchema}
                    updateSchema={ScienceClubUpdateFormSchema}
                    defaultValues={{ images: [] }}
                    mapToFormValues={(item: any) => ({
                        ...item,
                        school_id: item.school?.id,
                        coordinators_ids: item.coordinators?.map((c: any) => c.id) || [],
                    })}
                    renderFields={(props) => <ClubForm {...props} />}
                />
            ),
        },
        {
            id: "equipamentos",
            label: "Equipamentos",
            entityName: "equipment",
            parentIdField: "school_id",
            renderList: (parentId) => (
                <NestedEntityList
                    title="Equipamentos"
                    entityName="equipment"
                    parentId={parentId}
                    parentIdField="school_id"
                    fetchFn={(params) => getSchoolEquiments(params.school_id)}
                    createFn={async (data: z.infer<typeof EquipmentFormSchema>) => {
                        const { images, ...payload } = data;
                        const eq = await createEquipament(payload);
                        if (images?.length) {
                            const form = new FormData();
                            images.forEach((img: any) => {
                                if (img instanceof File) {
                                    form.append("images", img);
                                }
                            });
                            if (form.has("images")) {
                                await uploadEquipamentImages(eq.id, form);
                                return await getEquipamentById(eq.id);
                            }
                        }
                        return eq;
                    }}
                    updateFn={async (
                        id,
                        data: z.infer<typeof EquipmentUpdateFormSchema>
                    ) => {
                        const { images, ...payload } = data;
                        const eq = await updateEquipament(id, payload);
                        if (images?.length) {
                            const form = new FormData();
                            images.forEach((img: any) => {
                                if (img instanceof File) {
                                    form.append("images", img);
                                }
                            });
                            if (form.has("images")) {
                                await uploadEquipamentImages(id, form, true);
                                return await getEquipamentById(id);
                            }
                        }
                        return eq;
                    }}
                    deleteFn={deleteEquipament}
                    schema={EquipmentFormSchema}
                    createSchema={EquipmentFormSchema}
                    updateSchema={EquipmentUpdateFormSchema}
                    defaultValues={{ images: [] }}
                    mapToFormValues={(item: any) => ({
                        ...item,
                        school_id: item.school?.id,
                        type_equipment_id: item.type_equipment?.id,
                    })}
                    renderFields={(props) => <EquipmentForm {...props} />}
                />
            ),
        },
    ];

    const config: AdminEntityConfig<
        School,
        z.infer<typeof SchoolFormSchema>,
        z.infer<typeof SchoolUpdateFormSchema>,
        typeof SchoolFormSchema,
        typeof SchoolUpdateFormSchema
    > = {
        title: "Escolas",
        entityName: "schools",
        createSchema: SchoolFormSchema,
        updateSchema: SchoolUpdateFormSchema,
        defaultValues: { images: [] },
        mapToFormValues: (item: any) => ({
            ...item,
            identity_territory_id: item.identityTerritory?.id,
        }),
        renderForm: () => <SchoolForm />,
        childTabs,
        fetchFn: getSchools,
        createFn: handleCreate,
        updateFn: handleUpdate,
        deleteFn: deleteSchool,
    };

    return <EntityConsole config={config} params={params} />;
};

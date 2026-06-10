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
} from "@/core/service/SchoolService";
import {
    School,
    SchoolCreate,
    SchoolCreateSchema,
    SchoolFormSchema,
    SchoolUpdateFormSchema,
    SchoolUpdate,
    SchoolSearchParams,
} from "@/core/domain/School";
import { AdminEntityConfig, ChildTabConfig } from "@/core/interface/AdminEntity";
import { NestedEntityList } from "./generic/NestedEntityList";
import {
    getClubesCiencia,
    createClubeCiencias,
    updateClubeCiencias,
    deleteClubeCiencias,
    uploadClubImage,
} from "@/core/service/ClubeCienciaService";
import {
    getEquipaments,
    createEquipament,
    updateEquipament,
    deleteEquipament,
    uploadEquipamentImages,
} from "@/core/service/EquipamentoService";
import { ScienceClubFormSchema, ScienceClubUpdateFormSchema } from "@/core/domain/Club";
import { EquipmentFormSchema, EquipmentUpdateFormSchema } from "@/core/domain/Equipment";
import { ClubForm } from "./forms/ClubForm";
import { EquipmentForm } from "./forms/EquipmentForm";

interface SchoolAdmProps {
    params: SchoolSearchParams;
}

export const SchoolAdm = ({ params }: SchoolAdmProps) => {
    const handleCreate = async (data: any): Promise<School> => {
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
            }
        }
        return school;
    };

    const handleUpdate = async (id: string, data: any): Promise<School> => {
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
                    createFn={async (data: any) => {
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
                            }
                        }
                        return club;
                    }}
                    updateFn={async (id, data: any) => {
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
                    createFn={async (data: any) => {
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
                            }
                        }
                        return eq;
                    }}
                    updateFn={async (id, data: any) => {
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
        any,
        any,
        typeof SchoolFormSchema
    > = {
        title: "Escolas",
        entityName: "schools",
        schema: SchoolFormSchema,
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

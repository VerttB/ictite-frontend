"use client";

import React, { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
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
import { getTerritories } from "@/core/service/IdentityTerritoryService";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import z from "zod";

const SchoolFiltersModal = ({
    currentParams,
    applyParams,
    closeFilters,
}: {
    currentParams: any;
    applyParams: (params: any) => void;
    closeFilters: () => void;
}) => {
    const [selectedTerritory, setSelectedTerritory] = useState<string>("");
    const [territorySearchValue, setTerritorySearchValue] = useState<string>("");

    const { data: territoriesData } = useSWR("all-territories-filter", () =>
        getTerritories()
    );

    const territoryOptions = useMemo(() => {
        const list = territoriesData || [];
        const opts = list.map((t) => ({ value: t.id, label: t.name }));
        return [{ value: "all", label: "Todos os Territórios" }, ...opts];
    }, [territoriesData]);

    useEffect(() => {
        setSelectedTerritory((currentParams.identity_territory_id as string) || "");
    }, [currentParams]);

    useEffect(() => {
        const matched = territoriesData?.find((t) => t.id === selectedTerritory);
        setTerritorySearchValue(matched ? matched.name : "");
    }, [selectedTerritory, territoriesData]);

    const filteredTerritoryOptions = useMemo(() => {
        if (!territorySearchValue) return territoryOptions;
        return territoryOptions.filter((o) =>
            o.label.toLowerCase().includes(territorySearchValue.toLowerCase())
        );
    }, [territoryOptions, territorySearchValue]);

    const handleApply = () => {
        const newParams = { ...currentParams };

        newParams.identity_territory_id = selectedTerritory || undefined;

        applyParams(newParams);
        closeFilters();
    };

    const handleClear = () => {
        setSelectedTerritory("");
        const newParams = { ...currentParams };
        newParams.identity_territory_id = undefined;

        applyParams(newParams);
        closeFilters();
    };

    return (
        <>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Território de Identidade</label>
                    <Combobox
                        items={filteredTerritoryOptions}
                        value={
                            territoryOptions.find((o) => o.value === selectedTerritory) || null
                        }
                        inputValue={territorySearchValue}
                        onInputValueChange={(arg1) => {
                            const text = typeof arg1 === "string" ? arg1 : "";
                            setTerritorySearchValue(text);
                            if (text === "") setSelectedTerritory("");
                        }}
                        onValueChange={(val: any) => {
                            if (!val) {
                                setSelectedTerritory("");
                                setTerritorySearchValue("");
                            } else {
                                setSelectedTerritory(val.value === "all" ? "" : val.value);
                                setTerritorySearchValue(
                                    val.value === "all" ? "" : val.label
                                );
                            }
                        }}>
                        <ComboboxInput placeholder="Todos os Territórios" />
                        <ComboboxContent className="pointer-events-auto z-[9999]">
                            {filteredTerritoryOptions.length === 0 ? (
                                <ComboboxEmpty>Nenhuma opção encontrada</ComboboxEmpty>
                            ) : (
                                <ComboboxList>
                                    {filteredTerritoryOptions.map((opt) => (
                                        <ComboboxItem key={opt.value} value={opt}>
                                            {opt.label}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            )}
                        </ComboboxContent>
                    </Combobox>
                </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-between">
                <Button variant="outline" onClick={handleClear}>
                    Limpar Filtros
                </Button>
                <Button onClick={handleApply}>Aplicar</Button>
            </DialogFooter>
        </>
    );
};

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
        renderFilters: ({ currentParams, applyParams, closeFilters }) => (
            <SchoolFiltersModal
                currentParams={currentParams}
                applyParams={applyParams}
                closeFilters={closeFilters}
            />
        ),
        childTabs,
        fetchFn: getSchools,
        createFn: handleCreate,
        updateFn: handleUpdate,
        deleteFn: deleteSchool,
    };

    return <EntityConsole config={config} params={params} />;
};

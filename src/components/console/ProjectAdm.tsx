"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { EntityConsole } from "./generic/EntityConsole";
import { ProjectForm } from "./forms/ProjectForm";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    uploadProjectImages,
    getProjectById,
} from "@/core/service/ProjetoService";
import {
    Project,
    ProjectFormSchema,
    ProjectSearchParams,
    ProjectUpdateFormSchema,
} from "@/core/domain/Project";
import { getClubesCiencia } from "@/core/service/ClubeCienciaService";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";
import { ProjectMembersList } from "./ProjectMembersList";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import z from "zod";

const ProjectFiltersModal = ({
    currentParams,
    applyParams,
    closeFilters,
}: {
    currentParams: any;
    applyParams: (params: any) => void;
    closeFilters: () => void;
}) => {
    const [selectedClub, setSelectedClub] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");

    const [clubSearchValue, setClubSearchValue] = useState<string>("");

    const { data: clubsData } = useSWR("all-clubs-filter-projects", () =>
        getClubesCiencia({ size: 0 })
    );

    const clubOptions = useMemo(() => {
        const clubs = clubsData?.items || [];
        const opts = clubs.map((c) => ({ value: c.id, label: c.name }));
        return [{ value: "all", label: "Todos os Clubes" }, ...opts];
    }, [clubsData]);

    useEffect(() => {
        setSelectedClub((currentParams.clube_ciencia_id as string) || "");
        setSelectedYear(currentParams.year ? String(currentParams.year) : "");
    }, [currentParams]);

    useEffect(() => {
        const matched = clubsData?.items?.find((c) => c.id === selectedClub);
        setClubSearchValue(matched ? matched.name : "");
    }, [selectedClub, clubsData]);

    const filteredClubOptions = useMemo(() => {
        if (!clubSearchValue) return clubOptions;
        return clubOptions.filter((o) =>
            o.label.toLowerCase().includes(clubSearchValue.toLowerCase())
        );
    }, [clubOptions, clubSearchValue]);

    const handleApply = () => {
        const newParams = { ...currentParams };

        if (selectedClub) {
            newParams.clube_ciencia_id = selectedClub;
        } else {
            delete newParams.clube_ciencia_id;
        }

        if (selectedYear) {
            newParams.year = Number(selectedYear);
        } else {
            delete newParams.year;
        }

        delete newParams.school_id;

        applyParams(newParams);
        closeFilters();
    };

    const handleClear = () => {
        setSelectedClub("");
        setSelectedYear("");

        const newParams = { ...currentParams };
        delete newParams.clube_ciencia_id;
        delete newParams.year;
        delete newParams.school_id;

        applyParams(newParams);
        closeFilters();
    };

    return (
        <>
            <div className="grid gap-4 py-4">
                {/* Clube Field (Dynamic: Combobox) */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Clube de Ciência</label>
                    <Combobox
                        items={filteredClubOptions}
                        value={clubOptions.find((o) => o.value === selectedClub) || null}
                        inputValue={clubSearchValue}
                        onInputValueChange={(arg1) => {
                            const text = typeof arg1 === "string" ? arg1 : "";
                            setClubSearchValue(text);
                            if (text === "") setSelectedClub("");
                        }}
                        onValueChange={(val: any) => {
                            if (!val) {
                                setSelectedClub("");
                                setClubSearchValue("");
                            } else {
                                setSelectedClub(val.value === "all" ? "" : val.value);
                                setClubSearchValue(val.value === "all" ? "" : val.label);
                            }
                        }}>
                        <ComboboxInput placeholder="Todos os Clubes" />
                        <ComboboxContent className="pointer-events-auto z-[9999]">
                            {filteredClubOptions.length === 0 ? (
                                <ComboboxEmpty>Nenhuma opção encontrada</ComboboxEmpty>
                            ) : (
                                <ComboboxList>
                                    {filteredClubOptions.map((opt) => (
                                        <ComboboxItem key={opt.value} value={opt}>
                                            {opt.label}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            )}
                        </ComboboxContent>
                    </Combobox>
                </div>

                {/* Ano Field (Input number) */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Ano</label>
                    <Input
                        type="number"
                        placeholder="Digite o ano (Ex: 2026)"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    />
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

interface ProjectAdmProps {
    params: ProjectSearchParams;
}

export const ProjectAdm = ({ params }: ProjectAdmProps) => {
    const handleCreate = async (
        data: z.infer<typeof ProjectFormSchema>
    ): Promise<Project> => {
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
    };

    const handleUpdate = async (
        id: string,
        data: z.infer<typeof ProjectUpdateFormSchema>
    ): Promise<Project> => {
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
    };

    const config: AdminEntityConfig<
        Project,
        z.infer<typeof ProjectFormSchema>,
        z.infer<typeof ProjectUpdateFormSchema>,
        typeof ProjectFormSchema,
        typeof ProjectUpdateFormSchema
    > = {
        title: "Projetos",
        entityName: "projects",
        createSchema: ProjectFormSchema,
        updateSchema: ProjectUpdateFormSchema,
        defaultValues: { images: [] },
        mapToFormValues: (item: any) => ({
            ...item,
            clube_ciencia_id: item.clube?.id,
        }),
        renderForm: (props) => <ProjectForm {...props} />,
        renderFilters: (props) => <ProjectFiltersModal {...props} />,
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

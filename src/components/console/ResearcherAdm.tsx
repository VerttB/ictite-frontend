"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { PersonStanding, X } from "lucide-react";
import {
    createResearcher,
    deleteResearcher,
    getResearchers,
    updateResearcher,
} from "@/core/service/PesquisadorService";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../forms-input/InputField";
import { ControlledSelect } from "../forms-input/ControlledSelect";
import { ResearcherTypes } from "@/core/constants/researcherType";
import { RaceTypes } from "@/core/constants/race";
import { GenderTypes } from "@/core/constants/sex";
import {
    ResearcherSearchParams,
    ResearcherCreate,
    ResearcherCreateSchema,
    Researcher,
    ResearcherUpdate,
    ResearcherUpdateSchema,
} from "@/core/domain/Researcher";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { SearchAndFilter } from "../SearchAndFilter";
import { Pagination } from "../Pagination";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { useAdmCrud } from "@/hooks/useAdmCrud";
import { getProjects } from "@/core/service/ProjetoService";
import { useState } from "react";
import { Button } from "../ui/button";
import { ControlledMultiSelect } from "../forms-input/ControlledMultiSelect";
interface ResearcherAdmProps {
    params: ResearcherSearchParams;
}
export const ResearcherAdm = ({ params }: ResearcherAdmProps) => {
    const [seletectedProjects, setSelectedProjects] = useState<string[]>([]);
    const { data: pesquisadores, mutate } = useSWR(["researcher", params], ([, p]) =>
        getResearchers(p)
    );

    const { data: projects } = useSWR("projects", () => getProjects());
    const { applyFilters, changePage } = useUrlPagination();

    const crud = useAdmCrud<Researcher, ResearcherCreate, ResearcherUpdate>({
        mutate,
        deleteFn: deleteResearcher,
        createFn: createResearcher,
        updateFn: updateResearcher,
    });

    if (!pesquisadores) return null;
    return (
        <>
            <Section
                title="Pesquisadores"
                items={pesquisadores.items}
                icon={<PersonStanding />}
                onAdd={crud.ui.openCreate}
                onDelete={crud.ui.openDelete}
                onUpdate={crud.ui.openEdit}>
                <SearchAndFilter
                    currentParams={params}
                    applyParams={applyFilters}
                    mainSearchKey="name"
                    mainSearchPlaceholder="Buscar pesquisadores"
                    filters={[]}
                />
            </Section>
            <BaseFormModal<typeof ResearcherCreateSchema, ResearcherCreate>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={crud.actions.create}
                title="Adicionar Pesquisador"
                schema={ResearcherCreateSchema}>
                <InputField name="name" label="Nome do Pesquisador" />
                <InputField name="lattes_id" label="Id do Lattes" maxLength={16} />
                <div className="flex w-full gap-2">
                    <ControlledSelect
                        className="w-full"
                        name="type"
                        label="Tipo de Pesquisador"
                        options={Object.values(ResearcherTypes)}
                    />
                </div>
                <div className="flex w-full gap-2">
                    <ControlledSelect
                        className="w-full"
                        name="race"
                        label="Raça"
                        options={Object.values(RaceTypes)}
                    />
                    <ControlledSelect
                        className="w-full"
                        name="gender"
                        label="Gênero"
                        options={Object.values(GenderTypes)}
                    />
                </div>
                <ControlledMultiSelect
                    className="w-full"
                    name="projects_ids"
                    label="Projetos"
                    options={projects?.items || []}
                />

                <div className="mt-3 flex flex-wrap gap-2">
                    {projects?.items.map((a) => {
                        if (seletectedProjects.includes(a.id)) {
                            return (
                                <div
                                    key={a.id}
                                    className="bg-azul-claro flex items-center gap-1 rounded-full px-3 py-1 text-white">
                                    <span>{a.name}</span>
                                    <Button variant={"destructive"}>
                                        <X size={16} />
                                    </Button>
                                </div>
                            );
                        }
                    })}
                </div>
            </BaseFormModal>
            {crud.editingItem && (
                <BaseFormModal<typeof ResearcherUpdateSchema, ResearcherUpdate>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={crud.actions.update}
                    title="Atualizar Pesquisador"
                    schema={ResearcherUpdateSchema}
                    props={{
                        defaultValues: {
                            name: crud.editingItem?.name,
                            race: crud.editingItem?.race,
                            type: crud.editingItem?.type,
                            gender: crud.editingItem?.gender,
                        },
                    }}>
                    <InputField name="name" label="Nome do Pesquisador" />
                    <ControlledSelect
                        className="w-full"
                        name="race"
                        label="Raça"
                        options={Object.values(RaceTypes)}
                    />
                    <div className="flex w-full gap-2">
                        <ControlledSelect
                            className="w-full"
                            name="type"
                            label="Tipo de Pesquisador"
                            options={Object.values(ResearcherTypes)}
                        />
                        <ControlledSelect
                            className="w-full"
                            name="gender"
                            label="Gênero"
                            options={Object.values(GenderTypes)}
                        />
                    </div>
                </BaseFormModal>
            )}

            <DeleteConfirmationModal
                open={!!crud.deletingItem}
                onClose={crud.ui.closeDelete}
                onConfirm={crud.actions.delete}
                title={`Deseja excluir ${crud.deletingItem?.name}?`}
                description="Essa ação não pode ser desfeita."
            />
            <Pagination
                currentPage={pesquisadores.page}
                onLoadMore={changePage}
                totalPages={pesquisadores.total_pages}
            />
        </>
    );
};

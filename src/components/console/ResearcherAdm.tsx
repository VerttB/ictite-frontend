"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { useState } from "react";
import { PersonStanding } from "lucide-react";
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
interface ResearcherAdmProps {
    params: ResearcherSearchParams;
}
export const ResearcherAdm = ({ params }: ResearcherAdmProps) => {
    const { data: pesquisadores, mutate } = useSWR(["researcher", params], ([, p]) =>
        getResearchers(p)
    );
    const { applyFilters, changePage } = useUrlPagination();
    const [isCreating, setIsCreating] = useState(false);
    const [editingItem, setEditingItem] = useState<Researcher | null>(null);
    const [deletingItem, setDeletingItem] = useState<Researcher | null>(null);
    const onSubmit = async (data: ResearcherCreate) => {
        console.log("Researcher", data);
        await createResearcher(data);
        mutate();
        setIsCreating(false);
    };
    const onSubmitUpdate = async (data: any) => {
        try {
            if (editingItem) {
                await updateResearcher(editingItem.id, data);
                mutate();
            }
        } catch (error) {
            console.error("Error updating researcher:", error);
        } finally {
            setEditingItem(null);
        }
    };
    const onSubmitDelete = async () => {
        try {
            if (deletingItem) {
                await deleteResearcher(deletingItem.id);
                mutate();
            }
        } catch (error) {
            console.error("Error deleting researcher:", error);
        } finally {
            setDeletingItem(null);
        }
    };

    if (!pesquisadores) return null;
    return (
        <>
            <Section
                title="Pesquisadores"
                items={pesquisadores.items}
                icon={<PersonStanding />}
                onAdd={() => setIsCreating(true)}
                onDelete={(researcher) => setDeletingItem(researcher)}
                onUpdate={(researcher) => setEditingItem(researcher)}>
                <SearchAndFilter
                    currentParams={params as any}
                    applyParams={applyFilters}
                    mainSearchKey="name"
                    mainSearchPlaceholder="Buscar pesquisadores"
                    filters={[]}
                />
            </Section>
            <BaseFormModal<typeof ResearcherCreateSchema, ResearcherCreate>
                open={isCreating}
                onClose={() => setIsCreating(false)}
                onSubmit={onSubmit}
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
                    <Pagination
                        currentPage={pesquisadores.page}
                        onLoadMore={changePage}
                        totalPages={pesquisadores.total_pages}
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
            </BaseFormModal>
            {editingItem && (
                <BaseFormModal<typeof ResearcherUpdateSchema, ResearcherUpdate>
                    open={!!editingItem}
                    key={editingItem.id}
                    onClose={() => setEditingItem(null)}
                    onSubmit={onSubmitUpdate}
                    title="Atualizar Pesquisador"
                    schema={ResearcherUpdateSchema}
                    props={{
                        defaultValues: {
                            name: editingItem?.name,
                            race: editingItem?.race,
                            type: editingItem?.type,
                            gender: editingItem?.gender,
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
                open={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={onSubmitDelete}
                title={`Deseja excluir ${deletingItem?.name}?`}
                description="Essa ação não pode ser desfeita."
            />
        </>
    );
};

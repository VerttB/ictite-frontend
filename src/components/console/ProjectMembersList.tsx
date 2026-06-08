"use client";

import React from "react";
import useSWR from "swr";
import { Section } from "../Section";
import { useAdmCrud } from "@/hooks/useAdmCrud";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { BaseFormModal } from "../BaseFormAddModal";
import { getProjectResearchers, addResearcherToProject, removeResearcherFromProject } from "@/core/service/ProjetoService";
import { getResearchers } from "@/core/service/PesquisadorService";
import { ControlledComboBox } from "../forms-input/ControlledComboBox";
import z from "zod";

const AddMemberSchema = z.object({
    researcher_id: z.string().uuid("Selecione um pesquisador"),
});

export const ProjectMembersList = ({ projectId }: { projectId: string }) => {
    const { data: members, mutate } = useSWR(
        ["project-members", projectId],
        () => getProjectResearchers(projectId)
    );

    const { data: allResearchers } = useSWR("all-researchers", () => getResearchers());

    const crud = useAdmCrud<any, any, any>({
        mutate: mutate as any,
        deleteFn: async (researcherId) => {
            await removeResearcherFromProject(projectId, researcherId);
        },
    });

    // Flatten members from dict[str, list] to a single list for the Section
    const flattenedMembers = React.useMemo(() => {
        if (!members) return [];
        return Object.values(members).flat();
    }, [members]);

    const handleAddMember = async (data: { researcher_id: string }) => {
        await addResearcherToProject(projectId, data.researcher_id);
        await mutate();
        crud.ui.closeCreate();
    };

    return (
        <div className="flex flex-col gap-4">
            <Section<any>
                title="Membros do Projeto"
                items={flattenedMembers}
                onAdd={crud.ui.openCreate}
                onDelete={(item) => crud.ui.openDelete(item)}
            />

            <BaseFormModal<typeof AddMemberSchema, any>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={handleAddMember}
                title="Adicionar Membro"
                schema={AddMemberSchema}>
                <ControlledComboBox
                    name="researcher_id"
                    label="Pesquisador"
                    options={allResearchers?.items || []}
                />
            </BaseFormModal>

            <DeleteConfirmationModal
                open={!!crud.deletingItem}
                onClose={crud.ui.closeDelete}
                onConfirm={() => crud.actions.delete()}
                title={`Remover ${crud.deletingItem?.name} do projeto?`}
                description="O pesquisador continuará cadastrado no sistema."
            />
        </div>
    );
};

"use client";

import { Section } from "../Section";
import useSWR from "swr";
import {
    getProjects,
    createProject,
    uploadProjectImages,
    updateProject,
    deleteProject,
} from "@/core/service/ProjetoService";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../forms-input/InputField";
import { ControlledSelect } from "../forms-input/ControlledSelect";
import { ControlledImageUpload } from "../forms-input/ControlledImageInput";
import {
    Project,
    ProjectCreate,
    ProjectCreateSchema,
    ProjectUpdate,
    ProjectUpdateSchema,
    ProjectSearchParams,
} from "@/core/domain/Project";
import { getClubesCiencia } from "@/core/service/ClubeCienciaService";
import { Pagination } from "../Pagination";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { SearchAndFilter } from "../SearchAndFilter";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { useAdmCrud } from "@/hooks/useAdmCrud";
import { TextField } from "../forms-input/TextField";
import { yearValidation } from "@/core/constants/validation";
import { ControlledComboBox } from "../forms-input/ControlledComboBox";

interface ProjectAdmProps {
    params?: ProjectSearchParams;
}
export const ProjectAdm = ({ params }: ProjectAdmProps) => {
    const { data: projetos, mutate } = useSWR(["projetos", params], ([, p]) =>
        getProjects(p)
    );
    const { changePage, applyFilters } = useUrlPagination();
    const { data: clubes } = useSWR("clubes", () =>
        getClubesCiencia().then((res) => res.items)
    );

    const crud = useAdmCrud<Project, ProjectCreate, ProjectUpdate>({
        mutate,
        deleteFn: deleteProject,
    });

    const handleCreate = async (data: ProjectCreate) => {
        const { id } = await createProject(data);
        if (data.images?.length) {
            const form = new FormData();
            data.images.forEach((file) => form.append("images", file));
            await uploadProjectImages(id, form);
        }
    };

    const handleUpdate = async (id: string, data: ProjectUpdate) => {
        const { images, ...projectData } = data;
        await updateProject(id, projectData);
        if (images?.length) {
            const form = new FormData();
            images.forEach((file) => form.append("images", file));
            await uploadProjectImages(id, form, true);
        }
    };

    if (!projetos) return null;
    return (
        <>
            <Section<Project>
                title="Projetos"
                items={projetos.items}
                icon={null}
                onAdd={crud.ui.openCreate}
                onUpdate={crud.ui.openEdit}
                onDelete={crud.ui.openDelete}>
                <SearchAndFilter
                    currentParams={params || {}}
                    applyParams={applyFilters}
                    mainSearchKey="name"
                    mainSearchPlaceholder="Buscar projetos"
                    filters={[]}
                />
            </Section>

            <BaseFormModal<typeof ProjectCreateSchema, ProjectCreate>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={(data) => crud.actions.create(data, handleCreate)}
                title="Adicionar Projeto"
                schema={ProjectCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome do Projeto" />
                <InputField name="description" label="Descrição (Opcional)" />
                <ControlledComboBox
                    className="w-full"
                    name="clube_ciencia_id"
                    label="Clube"
                    options={clubes || []}
                />
                <ControlledSelect
                    name="year"
                    label="Ano (Opcional)"
                    options={new Array(yearValidation.max - yearValidation.min + 1)
                        .fill(null)
                        .map((_, i) => yearValidation.max - i)}
                />
                <TextField name="description_long" label="Descrição Longa (Opcional)" />
                <ControlledImageUpload name="images" label="Imagens (Opcional)" multiple={true} />
            </BaseFormModal>

            {crud.editingItem && (
                <BaseFormModal<typeof ProjectUpdateSchema, ProjectUpdate>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={(data) => crud.actions.update(data, handleUpdate)}
                    title="Atualizar Projeto"
                    schema={ProjectUpdateSchema}
                    props={{
                        defaultValues: {
                            name: crud.editingItem?.name,
                            description: crud.editingItem?.description || undefined,
                            description_long: crud.editingItem?.description_long || undefined,
                            clube_ciencia_id: crud.editingItem?.clube?.id,
                            year: crud.editingItem?.year?.toString(),
                            images: [],
                        },
                    }}>
                    <InputField name="name" label="Nome do Projeto" />
                    <InputField name="description" label="Descrição (Opcional)" />
                    <ControlledComboBox
                        className="w-full"
                        name="clube_ciencia_id"
                        label="Clube"
                        options={clubes || []}
                    />
                    <ControlledSelect
                        name="year"
                        label="Ano (Opcional)"
                        options={new Array(yearValidation.max - yearValidation.min + 1)
                            .fill(null)
                            .map((_, i) => yearValidation.max - i)}
                    />
                    <TextField name="description_long" label="Descrição Longa (Opcional)" />
                    <ControlledImageUpload name="images" label="Imagens (Opcional)" multiple={true} />
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
                currentPage={projetos.page}
                onLoadMore={changePage}
                totalPages={projetos.total_pages}
            />
        </>
    );
};

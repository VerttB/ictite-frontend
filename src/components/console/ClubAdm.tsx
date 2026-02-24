"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import {
    getClubesCiencia,
    createClubeCiencias,
    uploadClubImage,
    updateClubeCiencias,
    deleteClubeCiencias,
} from "@/core/service/ClubeCienciaService";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../forms-input/ControlledImageInput";
import { InputField } from "../forms-input/InputField";
import {
    ScienceClub,
    ScienceClubCreate,
    ScienceClubCreateSchema,
    ScienceClubUpdate,
    ScienceClubUpdateSchema,
    ScienceClubSearchParams,
} from "@/core/domain/Club";
import { Pagination } from "../Pagination";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { SearchAndFilter } from "../SearchAndFilter";
import { ItemFilterConfig } from "@/core/interface/ItemFilterConfig";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { useAdmCrud } from "@/hooks/useAdmCrud";
import { ControlledComboBox } from "../forms-input/ControlledComboBox";

interface ClubAdmProps {
    params?: ScienceClubSearchParams;
}

export const ClubAdm = ({ params }: ClubAdmProps) => {
    const { data: clubes, mutate } = useSWR(
        ["clubes", params],
        ([, p]) => getClubesCiencia(p),
        {
            keepPreviousData: true,
        }
    );
    const { applyFilters, changePage } = useUrlPagination();

    const { data: escolas } = useSWR("escolas", () => getSchools());

    const crud = useAdmCrud<ScienceClub, ScienceClubCreate, ScienceClubUpdate>({
        mutate,
        deleteFn: deleteClubeCiencias,
    });

    const handleCreate = async (data: ScienceClubCreate) => {
        const { id } = await createClubeCiencias(data);
        const form = new FormData();
        data.images.forEach((file) => form.append("images", file));
        await uploadClubImage(id, form);
    };

    const handleUpdate = async (id: string, data: ScienceClubUpdate) => {
        await updateClubeCiencias(id, data);
    };
    const filters: ItemFilterConfig<ScienceClubSearchParams>[] = [
        {
            label: "Nome",
            type: "text",
            value: "",
            key: "name",
        },
        {
            label: "Escola",
            type: "array",
            value: "",
            key: "school",
        },
    ];
    if (!clubes) return null;
    return (
        <div className="flex h-full w-full flex-col">
            <Section<ScienceClub>
                title="Clubes de Ciências"
                items={clubes.items}
                icon={null}
                onAdd={crud.ui.openCreate}
                onUpdate={crud.ui.openEdit}
                onDelete={crud.ui.openDelete}>
                <SearchAndFilter
                    currentParams={params || {}}
                    applyParams={applyFilters}
                    mainSearchKey="name"
                    mainSearchPlaceholder="Buscar projetos"
                    filters={filters}
                />
            </Section>

            <BaseFormModal<typeof ScienceClubCreateSchema, ScienceClubCreate>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={(data) => crud.actions.create(data, handleCreate)}
                title="Adicionar Clube de Ciências"
                schema={ScienceClubCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome do Clube de Ciências" />
                <InputField name="description" label="Descrição" />
                <ControlledComboBox
                    className="w-full"
                    name="school_id"
                    label="Escola"
                    options={escolas?.items || []}
                />
                <InputField name="instagram" label="Instagram (Opcional)" />

                <ControlledImageUpload name="images" multiple={true} />
            </BaseFormModal>

            {crud.editingItem && (
                <BaseFormModal<typeof ScienceClubUpdateSchema, ScienceClubUpdate>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={(data) => crud.actions.update(data, handleUpdate)}
                    title="Atualizar Clube de Ciências"
                    schema={ScienceClubUpdateSchema}
                    props={{
                        defaultValues: {
                            name: crud.editingItem?.name,
                            description: crud.editingItem?.description,
                            instagram: crud.editingItem?.instagram,
                        },
                    }}>
                    <InputField name="name" label="Nome do Clube de Ciências" />
                    <InputField name="description" label="Descrição" />
                    <InputField name="instagram" label="Instagram (Opcional)" />
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
                totalPages={clubes.total_pages}
                currentPage={clubes.page}
                onLoadMore={changePage}
            />
        </div>
    );
};

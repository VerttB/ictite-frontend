"use client";

import { Section } from "../Section";
import useSWR from "swr";
import {
    createSchool,
    deleteSchool,
    getSchools,
    updateSchool,
    uploadSchoolImage,
} from "@/core/service/SchoolService";
import { School2 } from "lucide-react";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../forms-input/ControlledImageInput";
import { InputField } from "../forms-input/InputField";
import { mask } from "@/lib/maskBuilder";
import { SchoolSearchParams } from "@/core/domain/School";
import {
    SchoolCreate,
    SchoolCreateSchema,
    SchoolUpdate,
    SchoolUpdateSchema,
    School,
} from "@/core/domain/School";
import { SearchAndFilter } from "../SearchAndFilter";
import { ItemFilterConfig } from "@/core/interface/ItemFilterConfig";
import { Pagination } from "../Pagination";

import { useUrlPagination } from "@/hooks/useUrlPagination";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { useAdmCrud } from "@/hooks/useAdmCrud";
interface SchoolAdmProps {
    params: SchoolSearchParams;
}

export const SchoolAdm = ({ params }: SchoolAdmProps) => {
    const { data: paginatedSchools, mutate } = useSWR(
        ["schools", params],
        ([, p]) => getSchools(p),
        {
            keepPreviousData: true,
        }
    );

    const crud = useAdmCrud<School, SchoolCreate, SchoolUpdate>({
        mutate,
        deleteFn: deleteSchool,
    });
    const { applyFilters, changePage } = useUrlPagination();

    const handleCreate = async (data: SchoolCreate) => {
        const { id } = await createSchool(data);
        if (data.images?.length) {
            const form = new FormData();
            data.images.forEach((img) => form.append("images", img));
            await uploadSchoolImage(id, form);
        }
    };
    const handleUpdate = async (id: string, data: SchoolUpdate) => {
        await updateSchool(id, data);
    };

    const filters: ItemFilterConfig<SchoolSearchParams>[] = [
        { label: "Nome", type: "text", value: "", key: "name" },
        { label: "Cidade", type: "text", value: "", key: "city" },
    ];
    if (!paginatedSchools) return null;

    return (
        <div className="flex h-full w-full flex-col">
            <Section<School>
                title="Escolas"
                items={paginatedSchools.items}
                icon={<School2 />}
                onAdd={crud.ui.openCreate}
                onUpdate={crud.ui.openEdit}
                onDelete={crud.ui.openDelete}>
                <SearchAndFilter
                    currentParams={params}
                    applyParams={applyFilters}
                    mainSearchKey="name"
                    mainSearchPlaceholder="Buscar escolas"
                    filters={filters}
                />
            </Section>

            <BaseFormModal<typeof SchoolCreateSchema, SchoolCreate>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={(data) => crud.actions.create(data, handleCreate)}
                title="Adicionar Escola"
                schema={SchoolCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome da Escola" />
                <InputField name="description" label="Descrição" />
                <InputField name="cep" label="CEP" mask={mask.cep} />

                <ControlledImageUpload name="images" />
            </BaseFormModal>

            {crud.editingItem && (
                <BaseFormModal<typeof SchoolUpdateSchema, SchoolUpdate>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={(data) => crud.actions.update(data, handleUpdate)}
                    title="Atualizar Escola"
                    schema={SchoolUpdateSchema}
                    props={{
                        defaultValues: {
                            name: crud.editingItem?.name,
                            description: crud.editingItem?.description,
                        },
                    }}>
                    <InputField name="name" label="Nome da Escola" />
                    <InputField name="description" label="Descrição" />
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
                currentPage={paginatedSchools.page}
                onLoadMore={changePage}
                totalPages={paginatedSchools.total_pages}
            />
        </div>
    );
};

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
import { useState } from "react";
import { School2 } from "lucide-react";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import { InputField } from "../ui/FormInputField";
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
interface SchoolAdmProps {
    params: SchoolSearchParams;
}

export const SchoolAdm = ({ params }: SchoolAdmProps) => {
    const {
        data: paginatedSchools,
        isLoading,
        mutate,
    } = useSWR(["schools", params], ([_, p]) => getSchools(p), {
        keepPreviousData: true,
    });

    const [isCreating, setIsCreating] = useState(false);
    const [editingItem, setEditingItem] = useState<School | null>(null);
    const [deletingItem, setDeletingItem] = useState<School | null>(null);

    const { applyFilters, changePage } = useUrlPagination();

    const onSubmit = async (data: SchoolCreate) => {
        try {
            const { id } = await createSchool(data);
            const form = new FormData();
            data.images.forEach((image) => {
                form.append("images", image);
            });

            await uploadSchoolImage(id, form);
            mutate();
            setIsCreating(false);
        } catch (error) {
            console.error("Error creating school:", error);
        }
    };

    const onSubmitUpdate = async (data: SchoolUpdate) => {
        if (!editingItem) return;
        try {
            await updateSchool(editingItem.id, data);
            mutate();
        } catch (error) {
            console.error("Error updating school:", error);
        } finally {
            setEditingItem(null);
        }
    };

    const onSubmitDelete = async () => {
        if (!deletingItem) return;
        try {
            await deleteSchool(deletingItem.id);
            mutate();
        } catch (error) {
            console.error("Error deleting school:", error);
        } finally {
            setDeletingItem(null);
        }
    };

    const filters: ItemFilterConfig[] = [
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
                onAdd={() => setIsCreating(true)}
                onUpdate={(school) => setEditingItem(school)}
                onDelete={(school) => setDeletingItem(school)}>
                <SearchAndFilter
                    currentParams={params as any}
                    applyParams={applyFilters}
                    mainSearchKey="name"
                    mainSearchPlaceholder="Buscar escolas"
                    filters={filters}
                />
            </Section>

            <BaseFormModal<typeof SchoolCreateSchema, SchoolCreate>
                open={isCreating}
                onClose={() => setIsCreating(false)}
                onSubmit={onSubmit}
                title="Adicionar Escola"
                schema={SchoolCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome da Escola" />
                <InputField name="description" label="Descrição" />
                <InputField name="cep" label="CEP" mask={mask.cep} />

                <ControlledImageUpload name="images" />
            </BaseFormModal>

            {editingItem && (
                <BaseFormModal<typeof SchoolUpdateSchema, SchoolUpdate>
                    open={!!editingItem}
                    key={editingItem.id}
                    onClose={() => setEditingItem(null)}
                    onSubmit={onSubmitUpdate}
                    title="Atualizar Escola"
                    schema={SchoolUpdateSchema}
                    props={{
                        defaultValues: {
                            name: editingItem?.name,
                            description: editingItem?.description,
                        },
                    }}>
                    <InputField name="name" label="Nome da Escola" />
                    <InputField name="description" label="Descrição" />
                </BaseFormModal>
            )}

            <DeleteConfirmationModal
                open={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={onSubmitDelete}
                title={`Deseja excluir ${deletingItem?.name}?`}
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

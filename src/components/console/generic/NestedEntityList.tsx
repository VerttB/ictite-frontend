"use client";

import React from "react";
import useSWR from "swr";
import { Section } from "../../Section";
import { useAdmCrud } from "@/hooks/useAdmCrud";
import { DeleteConfirmationModal } from "../../DeleteConfirmationModal";
import { BaseFormModal } from "../../BaseFormAddModal";
import { ZodType } from "zod";
import { FieldValues } from "react-hook-form";

interface NestedEntityListProps<T extends { id: string }, CreateDTO extends FieldValues, UpdateDTO extends FieldValues, TSchema extends ZodType<any, any, any>> {
    title: string;
    entityName: string;
    parentId: string;
    parentIdField: string;
    fetchFn: (params: any) => Promise<any>;
    createFn: (data: CreateDTO) => Promise<T>;
    updateFn: (id: string, data: UpdateDTO) => Promise<T>;
    deleteFn: (id: string) => Promise<void>;
    schema: TSchema;
    defaultValues: Partial<CreateDTO>;
    renderFields: (props: import("@/core/interface/AdminEntity").AdminFormProps) => React.ReactNode;
}

export const NestedEntityList = <T extends { id: string }, CreateDTO extends FieldValues, UpdateDTO extends FieldValues, TSchema extends ZodType<any, any, any>>({
    title,
    entityName,
    parentId,
    parentIdField,
    fetchFn,
    createFn,
    updateFn,
    deleteFn,
    schema,
    defaultValues,
    renderFields,
}: NestedEntityListProps<T, CreateDTO, UpdateDTO, TSchema>) => {
    const { data: paginatedData, mutate } = useSWR(
        [entityName, parentId],
        () => fetchFn({ [parentIdField]: parentId })
    );

    const crud = useAdmCrud<T, CreateDTO, UpdateDTO>({
        mutate,
        createFn,
        updateFn,
        deleteFn,
    });

    const handleCreate = (data: CreateDTO) => {
        return crud.actions.create({ ...data, [parentIdField]: parentId });
    };

    return (
        <div className="flex flex-col gap-4">
            <Section<any>
                title={title}
                items={Array.isArray(paginatedData) ? paginatedData : (paginatedData?.items || [])}
                onAdd={crud.ui.openCreate}
                onUpdate={crud.ui.openEdit}
                onDelete={crud.ui.openDelete}
            />

            <BaseFormModal<TSchema, any>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={handleCreate as any}
                title={`Adicionar ${title}`}
                schema={schema}
                props={{ defaultValues: { ...defaultValues, [parentIdField]: parentId } as any }}>
                {renderFields({ methods: null, parentId, parentIdField })}
            </BaseFormModal>

            {crud.editingItem && (
                <BaseFormModal<TSchema, any>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={crud.actions.update as any}
                    title={`Editar ${title}`}
                    schema={schema}
                    props={{ defaultValues: crud.editingItem as any }}>
                    {renderFields({ methods: null, parentId, parentIdField })}
                </BaseFormModal>
            )}

            <DeleteConfirmationModal
                open={!!crud.deletingItem}
                onClose={crud.ui.closeDelete}
                onConfirm={crud.actions.delete}
                title={`Deseja excluir ${crud.deletingItem?.name}?`}
                description="Essa ação não pode ser desfeita."
            />
        </div>
    );
};

"use client";

import React from "react";
import useSWR from "swr";
import { Section } from "../../Section";
import { useAdmCrud } from "@/hooks/useAdmCrud";
import { DeleteConfirmationModal } from "../../DeleteConfirmationModal";
import { BaseFormModal } from "../../BaseFormAddModal";
import { ZodType, type input } from "zod";
import { DefaultValues, FieldValues } from "react-hook-form";
import { AdminFormProps } from "@/core/interface/AdminEntity";
import { Pagination } from "@/schemas/Pagination";

interface NestedEntityListProps<
    T extends { id: string; name: string },
    CreateDTO extends FieldValues,
    UpdateDTO extends FieldValues,
    TCreateSchema extends ZodType<FieldValues, FieldValues>,
    TUpdateSchema extends ZodType<FieldValues, FieldValues>,
> {
    title: string;
    entityName: string;
    parentId: string;
    parentIdField: string;
    fetchFn: (params: FieldValues) => Promise<Pagination<T> | T[]>;
    createFn: (data: CreateDTO) => Promise<T>;
    updateFn: (id: string, data: UpdateDTO) => Promise<T>;
    deleteFn: (id: string) => Promise<void>;
    schema?: TCreateSchema; // Legacy compatibility
    createSchema: TCreateSchema;
    updateSchema: TUpdateSchema;
    defaultValues: Partial<CreateDTO>;
    mapToFormValues?: (item: T) => Partial<CreateDTO | UpdateDTO>;
    renderFields: (props: AdminFormProps) => React.ReactNode;
}

export const NestedEntityList = <
    T extends { id: string; name: string },
    CreateDTO extends FieldValues,
    UpdateDTO extends FieldValues,
    TCreateSchema extends ZodType<FieldValues, FieldValues>,
    TUpdateSchema extends ZodType<FieldValues, FieldValues>,
>({
    title,
    entityName,
    parentId,
    parentIdField,
    fetchFn,
    createFn,
    updateFn,
    deleteFn,
    schema,
    createSchema,
    updateSchema,
    defaultValues,
    mapToFormValues,
    renderFields,
}: NestedEntityListProps<
    T,
    CreateDTO,
    UpdateDTO,
    TCreateSchema,
    TUpdateSchema
>) => {
    const { data: paginatedData, mutate } = useSWR([entityName, parentId], () =>
        fetchFn({ [parentIdField]: parentId })
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
            <Section<T>
                title={title}
                items={
                    Array.isArray(paginatedData)
                        ? paginatedData
                        : paginatedData?.items || []
                }
                onAdd={crud.ui.openCreate}
                onUpdate={crud.ui.openEdit}
                onDelete={crud.ui.openDelete}
            />

            <BaseFormModal<TCreateSchema, unknown>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={(values) => handleCreate(values as CreateDTO)}
                title={`Adicionar ${title}`}
                schema={createSchema || schema}
                props={{
                    defaultValues: { ...defaultValues, [parentIdField]: parentId } as DefaultValues<input<TCreateSchema>>,
                }}>
                {renderFields({ parentId, parentIdField })}
            </BaseFormModal>

            {crud.editingItem && (
                <BaseFormModal<TUpdateSchema, unknown>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={(values) => crud.actions.update(values as UpdateDTO)}
                    title={`Editar ${title}`}
                    schema={updateSchema || schema}
                    props={{
                        defaultValues: mapToFormValues
                            ? mapToFormValues(crud.editingItem) as DefaultValues<input<TUpdateSchema>>
                            : crud.editingItem as DefaultValues<input<TUpdateSchema>>,
                    }}>
                    {renderFields({ parentId, parentIdField })}
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

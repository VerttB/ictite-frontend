"use client";

import React from "react";
import useSWR from "swr";
import { Section } from "../../Section";
import { useAdmCrud } from "@/hooks/useAdmCrud";
import { DeleteConfirmationModal } from "../../DeleteConfirmationModal";
import { BaseFormModal } from "../../BaseFormAddModal";
import { ZodType } from "zod";
import { FieldValues } from "react-hook-form";
import { AdminFormProps } from "@/core/interface/AdminEntity";

interface NestedEntityListProps<
    T extends { id: string; name?: string },
    CreateDTO extends FieldValues,
    UpdateDTO extends FieldValues,
    TCreateSchema extends ZodType<any, any, any>,
    TUpdateSchema extends ZodType<any, any, any>,
> {
    title: string;
    entityName: string;
    parentId: string;
    parentIdField: string;
    fetchFn: (params: any) => Promise<any>;
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
    T extends { id: string; name?: string },
    CreateDTO extends FieldValues,
    UpdateDTO extends FieldValues,
    TCreateSchema extends ZodType<any, any, any>,
    TUpdateSchema extends ZodType<any, any, any>,
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
            <Section<any>
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

            <BaseFormModal<any, any>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={handleCreate as any}
                title={`Adicionar ${title}`}
                schema={createSchema || schema}
                props={{
                    defaultValues: { ...defaultValues, [parentIdField]: parentId } as any,
                }}>
                {renderFields({ methods: null, parentId, parentIdField })}
            </BaseFormModal>

            {crud.editingItem && (
                <BaseFormModal<any, any>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={crud.actions.update as any}
                    title={`Editar ${title}`}
                    schema={updateSchema || schema}
                    props={{
                        defaultValues: mapToFormValues
                            ? (mapToFormValues(crud.editingItem) as any)
                            : (crud.editingItem as any),
                    }}>
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

import { ApiError } from "@/lib/api/error";
import { Pagination } from "@/schemas/Pagination";
import { useState } from "react";
import { toast } from "sonner";
import { KeyedMutator } from "swr";
interface UseAdmCrudProps<T, CreateDTO, UpdateDTO> {
    mutate: KeyedMutator<Pagination<T>>;
    createFn?: (data: CreateDTO) => Promise<T | void>;
    updateFn?: (id: string, data: UpdateDTO) => Promise<T | void>;
    deleteFn?: (id: string) => Promise<void>;
}

export const useAdmCrud = <T extends { id: string }, CreateDTO, UpdateDTO>({
    mutate,
    createFn,
    updateFn,
    deleteFn,
}: UseAdmCrudProps<T, CreateDTO, UpdateDTO>) => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [deletingItem, setDeletingItem] = useState<T | null>(null);

    const handleCreate = async (
        data: CreateDTO,
        customFn?: (data: CreateDTO) => Promise<T | void>
    ) => {
        try {
            const fn = customFn || createFn;
            if (!fn) throw new Error("Função de criação não fornecida");

            await fn(data);
            await mutate();
            setIsCreating(false);
        } catch (error) {
            let message = "Erro ao criar o item.";
            if (error instanceof ApiError) {
                console.log(error.message);
                message = error.message;
            }
            toast.error(message, {
                position: "top-center",
                duration: 5000,
                closeButton: true,
            });
        }
    };

    const handleUpdate = async (
        data: UpdateDTO,
        customFn?: (id: string, data: UpdateDTO) => Promise<T | void>
    ) => {
        if (!editingItem) return;
        try {
            const fn = customFn || updateFn;
            if (!fn) throw new Error("Função de atualização não fornecida");

            await fn(editingItem.id, data);
            await mutate();
            setEditingItem(null);
        } catch (error) {
            const message =
                error instanceof ApiError ? error.message : "Erro ao atualizar o item.";
            toast.error(message, {
                position: "top-center",
                duration: 5000,
                closeButton: true,
            });
        }
    };

    const handleDelete = async () => {
        if (!deletingItem) return;
        try {
            if (!deleteFn) throw new Error("Função de delete não fornecida");

            await deleteFn(deletingItem.id);
            await mutate();
            setDeletingItem(null);
        } catch (error) {
            const message =
                error instanceof ApiError ? error.message : "Erro ao deletar o item.";
            toast.error(message, {
                position: "top-center",
                duration: 5000,
                closeButton: true,
            });
        }
    };

    const ui = {
        openCreate: () => setIsCreating(true),
        closeCreate: () => setIsCreating(false),

        openEdit: (item: T) => setEditingItem(item),
        closeEdit: () => setEditingItem(null),

        openDelete: (item: T) => setDeletingItem(item),
        closeDelete: () => setDeletingItem(null),
    };

    const actions = {
        create: handleCreate,
        update: handleUpdate,
        delete: handleDelete,
    };
    return {
        isCreating,
        editingItem,
        deletingItem,

        actions,
        ui,
    };
};

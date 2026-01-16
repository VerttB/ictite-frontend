"use client";
import { Section } from "../Section";
import {
    createRevista,
    getRevistas,
    uploadMagazineImage,
    updateRevista,
    deleteRevista,
} from "@/core/service/RevistaService";
import { Book } from "lucide-react";
import useSWR from "swr";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../forms-input/InputField";
import { ControlledImageUpload } from "../forms-input/ControlledImageInput";
import {
    Magazine,
    MagazineCreate,
    MagazineCreateSchema,
    MagazineUpdate,
    MagazineUpdateSchema,
    MagazineSearchParams,
} from "@/core/domain/Magazine";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { useAdmCrud } from "@/hooks/useAdmCrud";

interface MagazineAdmProps {
    params?: MagazineSearchParams;
}
export const MagazineAdm = ({ params }: MagazineAdmProps) => {
    const { data: revistas, mutate } = useSWR(["magazines", params], ([, p]) =>
        getRevistas(p)
    );

    const crud = useAdmCrud<Magazine, MagazineCreate, MagazineUpdate>({
        mutate,
        deleteFn: deleteRevista,
    });

    const handleCreate = async (data: MagazineCreate) => {
        const { id } = await createRevista(data);
        const form = new FormData();
        for (const file of data.images) {
            form.append("images", file);
        }
        await uploadMagazineImage(id, form);
    };

    const handleUpdate = async (id: string, data: MagazineUpdate) => {
        await updateRevista(id, data);
    };
    return (
        <>
            <Section<Magazine>
                title="Revistas"
                items={revistas?.items || []}
                onAdd={crud.ui.openCreate}
                onUpdate={crud.ui.openEdit}
                onDelete={crud.ui.openDelete}
                icon={<Book />}
            />
            <BaseFormModal<typeof MagazineCreateSchema, MagazineCreate>
                open={crud.isCreating}
                onClose={crud.ui.closeCreate}
                onSubmit={(data) => crud.actions.create(data, handleCreate)}
                schema={MagazineCreateSchema}
                title="Adicionar Revista"
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Título da Revista" />
                <InputField name="description" label="Descrição" />
                <InputField name="link" label="Link da Revista" />
                <ControlledImageUpload name="images" />
            </BaseFormModal>

            {crud.editingItem && (
                <BaseFormModal<typeof MagazineUpdateSchema, MagazineUpdate>
                    open={!!crud.editingItem}
                    key={crud.editingItem.id}
                    onClose={crud.ui.closeEdit}
                    onSubmit={(data) => crud.actions.update(data, handleUpdate)}
                    title="Atualizar Revista"
                    schema={MagazineUpdateSchema}
                    props={{
                        defaultValues: {
                            name: crud.editingItem?.name,
                            description: crud.editingItem?.description,
                            link: crud.editingItem?.link,
                        },
                    }}>
                    <InputField name="name" label="Título da Revista" />
                    <InputField name="description" label="Descrição" />
                    <InputField name="link" label="Link da Revista" />
                </BaseFormModal>
            )}

            <DeleteConfirmationModal
                open={!!crud.deletingItem}
                onClose={crud.ui.closeDelete}
                onConfirm={crud.actions.delete}
                title={`Deseja excluir ${crud.deletingItem?.name}?`}
                description="Essa ação não pode ser desfeita."
            />
        </>
    );
};

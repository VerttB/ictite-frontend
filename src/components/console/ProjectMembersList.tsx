"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Section } from "../Section";
import { useAdmCrud } from "@/hooks/useAdmCrud";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    getProjectResearchers,
    removeResearcherFromProject,
    addResearchersToProject,
} from "@/core/service/ProjetoService";
import { getResearchers } from "@/core/service/PesquisadorService";
import { LoaderCircle, Check, Search } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { toast } from "sonner";

export const ProjectMembersList = ({ projectId }: { projectId: string }) => {
    const { data: members, mutate } = useSWR(["project-members", projectId], () =>
        getProjectResearchers(projectId)
    );

    const { data: allResearchers } = useSWR("all-researchers", () =>
        getResearchers({ size: 0 })
    );

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchValue] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const crud = useAdmCrud<any, any, any>({
        mutate: mutate as any,
        deleteFn: async (researcherId) => {
            await removeResearcherFromProject(projectId, researcherId);
        },
    });

    const flattenedMembers = React.useMemo(() => {
        if (!members) return [];
        return Object.values(members).flat();
    }, [members]);

    const existingMemberIds = React.useMemo(() => {
        return flattenedMembers.map((m) => m.id);
    }, [flattenedMembers]);

    const filteredResearchers = React.useMemo(() => {
        if (!allResearchers?.items) return [];
        return allResearchers.items.filter((r) =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allResearchers, searchTerm]);

    const toggleResearcher = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSaveMembers = async () => {
        if (selectedIds.length === 0) return;

        setIsSaving(true);
        try {
            await addResearchersToProject(projectId, selectedIds);
            await mutate();
            toast.success(`${selectedIds.length} pesquisadores adicionados com sucesso!`);
            handleClose();
        } catch (error) {
            toast.error("Erro ao adicionar alguns pesquisadores.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setSelectedIds([]);
        setSearchValue("");
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

            <Dialog open={crud.isCreating} onOpenChange={(s) => !s && handleClose()}>
                <DialogContent className="flex max-h-[90vh] flex-col sm:w-640 sm:max-w-7xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            Gerenciar Membros do Projeto
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative my-4">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <Input
                            placeholder="Buscar pesquisadores para adicionar..."
                            className="h-14 w-full rounded-md border-1 pl-12 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="min-h-[500px] flex-1 overflow-y-auto p-2 pr-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredResearchers.map((researcher) => {
                                const isAlreadyAdded = existingMemberIds.includes(
                                    researcher.id
                                );
                                const isSelected = selectedIds.includes(researcher.id);

                                return (
                                    <div
                                        key={researcher.id}
                                        onClick={() =>
                                            !isAlreadyAdded &&
                                            toggleResearcher(researcher.id)
                                        }
                                        className={`relative flex min-w-[260px] cursor-pointer items-center rounded-2xl border-2 p-5 transition-all ${
                                            isAlreadyAdded
                                                ? "cursor-not-allowed border-green-200 bg-green-50/40 opacity-90 shadow-sm"
                                                : isSelected
                                                  ? "border-primary bg-primary/5 ring-primary/20 scale-[1.03] shadow-lg ring-1"
                                                  : "hover:border-primary/40 border-gray-200 hover:bg-gray-50 hover:shadow-md"
                                        }`}>
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
                                            {researcher.image ? (
                                                <Image
                                                    src={researcher.image}
                                                    alt={researcher.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center font-bold">
                                                    {researcher.name.charAt(0)}
                                                </div>
                                            )}
                                            {isAlreadyAdded && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-green-500/10">
                                                    <div className="rounded-full bg-green-600 p-0.5 text-white shadow-lg ring-2 ring-white">
                                                        <Check
                                                            size={16}
                                                            strokeWidth={4}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {isSelected && !isAlreadyAdded && (
                                                <div className="bg-primary/20 absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-primary rounded-full p-0.5 text-white shadow-lg ring-2 ring-white">
                                                        <Check
                                                            size={16}
                                                            strokeWidth={4}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4 flex flex-col overflow-hidden">
                                            <span
                                                className="text-font-primary truncate text-base leading-tight font-semibold"
                                                title={researcher.name}>
                                                {researcher.name}
                                            </span>
                                            <span className="text-muted-foreground mt-1 truncate text-xs font-medium tracking-wider uppercase">
                                                {researcher.type}
                                            </span>
                                            {isAlreadyAdded && (
                                                <span className="mt-1.5 flex items-center text-[11px] font-bold text-green-600 uppercase">
                                                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                                    Membro Ativo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredResearchers.length === 0 && (
                                <div className="col-span-full py-10 text-center text-gray-500">
                                    Nenhum pesquisador encontrado.
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-4 gap-4 border-t pt-4 sm:gap-0">
                        <div className="mr-auto flex items-center text-sm text-gray-600">
                            {selectedIds.length} selecionado(s)
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSaveMembers}
                                disabled={selectedIds.length === 0 || isSaving}
                                className="min-w-[100px]">
                                {isSaving ? (
                                    <LoaderCircle className="animate-spin" size={18} />
                                ) : (
                                    "Adicionar Selecionados"
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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

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
    addResearcherToProject,
    removeResearcherFromProject,
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
        getResearchers({ page: 1, size: 1000, gender: [], type: [], race: [] })
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

    // Flatten members from dict[str, list] to a single list for the Section
    const flattenedMembers = React.useMemo(() => {
        if (!members) return [];
        return Object.values(members).flat();
    }, [members]);

    const existingMemberIds = React.useMemo(() => {
        return flattenedMembers.map((m) => m.id);
    }, [flattenedMembers]);

    const filteredResearchers = React.useMemo(() => {
        if (!allResearchers?.items) return [];
        return allResearchers.items.filter(
            (r) => r.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            await Promise.all(
                selectedIds.map((id) => addResearcherToProject(projectId, id))
            );
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
                <DialogContent className="flex max-h-[90vh] max-w-6xl flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Gerenciar Membros do Projeto</DialogTitle>
                    </DialogHeader>

                    <div className="relative my-4">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <Input
                            placeholder="Buscar pesquisadores para adicionar..."
                            className="h-12 pl-10 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="min-h-[400px] flex-1 overflow-y-auto p-1 pr-2">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredResearchers.map((researcher) => {
                                const isAlreadyAdded = existingMemberIds.includes(researcher.id);
                                const isSelected = selectedIds.includes(researcher.id);

                                return (
                                    <div
                                        key={researcher.id}
                                        onClick={() => !isAlreadyAdded && toggleResearcher(researcher.id)}
                                        className={`relative flex min-w-[240px] cursor-pointer items-center rounded-xl border-2 p-4 transition-all ${
                                            isAlreadyAdded
                                                ? "cursor-not-allowed border-green-200 bg-green-50/30 opacity-90 shadow-sm"
                                                : isSelected
                                                  ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                                                  : "hover:border-primary/50 border-gray-200 hover:bg-gray-50"
                                        }`}>
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                                            {researcher.image ? (
                                                <Image
                                                    src={researcher.image}
                                                    alt={researcher.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-muted font-bold text-muted-foreground">
                                                    {researcher.name.charAt(0)}
                                                </div>
                                            )}
                                            {isAlreadyAdded && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-green-500/10">
                                                    <div className="bg-green-600 rounded-full p-0.5 text-white shadow-lg ring-2 ring-white">
                                                        <Check
                                                            size={16}
                                                            strokeWidth={4}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {isSelected && !isAlreadyAdded && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
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
                                                className="truncate text-base font-semibold leading-tight text-foreground"
                                                title={researcher.name}>
                                                {researcher.name}
                                            </span>
                                            <span className="mt-1 truncate text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {researcher.type}
                                            </span>
                                            {isAlreadyAdded && (
                                                <span className="text-green-600 mt-1.5 flex items-center text-[11px] font-bold uppercase">
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

                    <DialogFooter className="mt-4 gap-2 border-t pt-4 sm:gap-0">
                        <div className="mr-auto flex items-center text-sm text-gray-600">
                            {selectedIds.length} selecionado(s)
                        </div>
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

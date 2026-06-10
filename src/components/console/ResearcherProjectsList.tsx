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
    getProjects,
    addResearcherToProject,
    removeResearcherFromProject,
} from "@/core/service/ProjetoService";
import { getResearcherProjects } from "@/core/service/PesquisadorService";
import { LoaderCircle, Check, Search } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { toast } from "sonner";

export const ResearcherProjectsList = ({ researcherId }: { researcherId: string }) => {
    const { data: projects, mutate } = useSWR(["researcher-projects", researcherId], () =>
        getResearcherProjects(researcherId)
    );

    const { data: allProjects } = useSWR("all-projects", () => getProjects({ size: 0 }));

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchValue] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const crud = useAdmCrud<any, any, any>({
        mutate: mutate as any,
        deleteFn: async (projectId) => {
            await removeResearcherFromProject(projectId, researcherId);
        },
    });

    const existingProjectIds = React.useMemo(() => {
        if (!projects) return [];
        return projects.map((p) => p.id);
    }, [projects]);

    const filteredProjects = React.useMemo(() => {
        if (!allProjects?.items) return [];
        return allProjects.items.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allProjects, searchTerm]);

    const toggleProject = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSaveProjects = async () => {
        if (selectedIds.length === 0) return;

        setIsSaving(true);
        try {
            for (const projectId of selectedIds) {
                await addResearchersToProject(projectId, [researcherId]);
            }
            await mutate();
            toast.success(`${selectedIds.length} projetos vinculados com sucesso!`);
            handleClose();
        } catch (error) {
            toast.error("Erro ao vincular alguns projetos.");
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
                title="Projetos Vinculados"
                items={projects || []}
                onAdd={crud.ui.openCreate}
                onDelete={(item) => crud.ui.openDelete(item)}
            />

            <Dialog open={crud.isCreating} onOpenChange={(s) => !s && handleClose()}>
                <DialogContent className="flex max-h-[90vh] flex-col sm:w-640 sm:max-w-7xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            Vincular a Projetos
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative my-4">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <Input
                            placeholder="Buscar projetos pelo nome..."
                            className="h-14 w-full pl-12 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="min-h-[500px] flex-1 overflow-y-auto p-2 pr-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProjects.map((project) => {
                                const isAlreadyAdded = existingProjectIds.includes(
                                    project.id
                                );
                                const isSelected = selectedIds.includes(project.id);
                                const imageUrl =
                                    project.images && project.images.length > 0
                                        ? project.images[0].url
                                        : null;

                                return (
                                    <div
                                        key={project.id}
                                        onClick={() =>
                                            !isAlreadyAdded && toggleProject(project.id)
                                        }
                                        className={`relative flex min-w-[260px] cursor-pointer items-center rounded-2xl border-2 p-5 transition-all ${
                                            isAlreadyAdded
                                                ? "cursor-not-allowed border-green-200 bg-green-50/40 opacity-90 shadow-sm"
                                                : isSelected
                                                  ? "border-primary bg-primary/5 ring-primary/20 scale-[1.03] shadow-lg ring-1"
                                                  : "hover:border-primary/40 border-gray-200 hover:bg-gray-50 hover:shadow-md"
                                        }`}>
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={project.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center font-bold">
                                                    {project.name.charAt(0)}
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
                                                className="text-foreground truncate text-base leading-tight font-semibold"
                                                title={project.name}>
                                                {project.name}
                                            </span>
                                            <span className="text-muted-foreground mt-1 truncate text-xs font-medium tracking-wider uppercase">
                                                {project.clube?.name || "Sem Clube"}
                                            </span>
                                            {isAlreadyAdded && (
                                                <span className="mt-1.5 flex items-center text-[11px] font-bold text-green-600 uppercase">
                                                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                                    Vinculado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredProjects.length === 0 && (
                                <div className="col-span-full py-10 text-center text-gray-500">
                                    Nenhum projeto encontrado.
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
                            onClick={handleSaveProjects}
                            disabled={selectedIds.length === 0 || isSaving}
                            className="min-w-[100px]">
                            {isSaving ? (
                                <LoaderCircle className="animate-spin" size={18} />
                            ) : (
                                "Vincular Selecionados"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DeleteConfirmationModal
                open={!!crud.deletingItem}
                onClose={crud.ui.closeDelete}
                onConfirm={() => crud.actions.delete()}
                title={`Desvincular do projeto ${crud.deletingItem?.name}?`}
                description="O projeto continuará existindo no sistema."
            />
        </div>
    );
};

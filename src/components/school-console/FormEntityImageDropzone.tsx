"use client";

import { useState } from "react";
import useSWR from "swr";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";
import { MAX_IMAGE_SIZE, isAcceptedImageFile } from "@/core/constants/Image";

interface FormEntityImageDropzoneProps {
    entityType: "clube_ciencias" | "project" | "equipment";
    entityId: string;
    readOnly?: boolean;
    label?: string;
}

export function FormEntityImageDropzone({ entityType, entityId, readOnly = false, label }: FormEntityImageDropzoneProps) {
    const [isUploading, setIsUploading] = useState(false);

    const swrKey = entityId ? `/submissions/current/images/${entityType}/${entityId}` : null;

    const { data, mutate, isLoading } = useSWR(swrKey, () => schoolSubmissionService.getFormEntityImages(entityType, entityId));

    const images = data?.images ?? [];

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter((file) => {
            const validType = isAcceptedImageFile(file);
            const validSize = file.size <= MAX_IMAGE_SIZE;
            if (!validType) toast.error(`Formato inválido: ${file.name}`);
            if (!validSize) toast.error(`Arquivo muito grande (máx 5MB): ${file.name}`);
            return validType && validSize;
        });

        if (validFiles.length === 0) {
            e.target.value = "";
            return;
        }

        if (images.length + validFiles.length > 5) {
            toast.error("Limite de 5 imagens por item excedido");
            e.target.value = "";
            return;
        }

        try {
            setIsUploading(true);
            await schoolSubmissionService.uploadFormEntityImages(entityType, entityId, validFiles);
            await mutate();
            toast.success("Imagens enviadas com sucesso!");
        } catch (err: any) {
            const detail = err?.detail || err?.message;
            toast.error(detail ? `Erro: ${detail}` : "Erro ao enviar imagens.");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const handleRemoveSingle = async (filename: string) => {
        try {
            setIsUploading(true);
            await schoolSubmissionService.deleteSingleFormEntityImage(entityType, entityId, filename);
            await mutate();
            toast.success("Imagem removida.");
        } catch {
            toast.error("Erro ao remover imagem.");
        } finally {
            setIsUploading(false);
        }
    };

    const titleMap: Record<string, string> = {
        clube_ciencias: "Imagens do Clube",
        project: "Imagens do Projeto",
        equipment: "Imagens do Equipamento",
    };

    const displayLabel = label ?? titleMap[entityType] ?? "Imagens";

    return (
        <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <ImageIcon size={14} className="text-[#088077]" />
                    {displayLabel}
                    <span className="font-normal text-gray-500">({images.length}/5)</span>
                </label>
                {images.length > 0 && <span className="text-[11px] font-medium text-emerald-600">✓ {images.length} imagem(ns) no rascunho</span>}
            </div>

            <label
                className={`group relative flex min-h-[110px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#088077]/30 bg-[#088077]/5 p-4 transition-all duration-200 ${
                    readOnly ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:border-[#088077] hover:bg-[#088077]/10"
                }`}>
                {!readOnly && (
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isUploading || readOnly || images.length >= 5}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                )}

                {isLoading || isUploading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-2 text-[#088077]">
                        <Loader2 className="animate-spin" size={22} />
                        <span className="text-xs font-semibold">{isUploading ? "Enviando..." : "Carregando..."}</span>
                    </div>
                ) : images.length > 0 ? (
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex flex-wrap gap-2">
                            {images.map((img) => (
                                <div key={img.filename} className="relative size-20 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs">
                                    <img src={img.url} alt={img.filename} className="h-full w-full object-cover" />
                                    {!readOnly && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRemoveSingle(img.filename);
                                            }}
                                            className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white shadow-md hover:bg-red-600">
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!readOnly && images.length < 5 && (
                            <p className="text-center text-xs font-medium text-[#088077]">Clique para adicionar mais imagens (até 5, máx 5MB cada)</p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <div className="rounded-full bg-[#088077]/15 p-2.5 text-[#088077] transition-transform group-hover:scale-110">
                            <UploadCloud size={20} />
                        </div>
                        <p className="text-xs font-semibold text-[#088077]">Adicionar imagens</p>
                        <span className="text-[11px] text-gray-500">{readOnly ? "Nenhuma imagem anexada." : "Clique para selecionar (até 5 imagens, 5MB cada)"}</span>
                    </div>
                )}
            </label>
        </div>
    );
}

"use client";

import { useState } from "react";
import useSWR from "swr";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";

interface SchoolImageDropzoneProps {
    readOnly?: boolean;
}

export function SchoolImageDropzone({ readOnly = false }: SchoolImageDropzoneProps) {
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const { data, mutate, isLoading } = useSWR(
        "/submissions/current/image",
        () => schoolSubmissionService.getFormImage()
    );

    const currentImageUrl = data?.url;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            await schoolSubmissionService.uploadFormImage(file);
            await mutate();
            toast.success("Imagem do formulário enviada com sucesso!");
        } catch {
            toast.error("Erro ao enviar a imagem do formulário.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setIsUploading(true);
            await schoolSubmissionService.deleteFormImage();
            await mutate();
            toast.success("Imagem do formulário removida.");
        } catch {
            toast.error("Erro ao remover a imagem.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <ImageIcon size={16} className="text-[#088077]" />
                    Imagem do Formulário da Escola
                </label>
                {currentImageUrl && (
                    <span className="text-[11px] font-medium text-emerald-600">
                        ✓ Imagem carregada da pasta do formulário
                    </span>
                )}
            </div>

            <label
                className={`group relative flex min-h-[160px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#088077]/40 bg-[#088077]/5 p-6 transition-all duration-200 ${
                    readOnly ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:border-[#088077] hover:bg-[#088077]/10"
                }`}>
                {!readOnly && (
                    <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading || readOnly}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                )}

                {isLoading || isUploading ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-[#088077]">
                        <Loader2 className="animate-spin" size={28} />
                        <span className="text-xs font-semibold">
                            {isUploading ? "Enviando imagem..." : "Carregando imagem..."}
                        </span>
                    </div>
                ) : currentImageUrl ? (
                    <div className="relative flex flex-col items-center justify-center gap-2">
                        <img
                            src={currentImageUrl}
                            alt="Logomarca / Imagem do formulário da escola"
                            className="max-h-36 rounded-xl object-cover shadow-sm border border-gray-200"
                        />
                        {!readOnly && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute -right-3 -top-3 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600 transition-transform hover:scale-110"
                                title="Remover imagem"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="rounded-full bg-[#088077]/15 p-3 text-[#088077] transition-transform group-hover:scale-110">
                            <UploadCloud size={28} />
                        </div>
                        <p className="text-sm font-semibold text-[#088077]">
                            Adicionar Imagem da Escola para o Formulário
                        </p>
                        <span className="text-xs text-gray-500">
                            {readOnly
                                ? "Nenhuma imagem foi anexada."
                                : "Clique ou arraste uma imagem (PNG, JPG ou WEBP)"}
                        </span>
                    </div>
                )}
            </label>
        </div>
    );
}

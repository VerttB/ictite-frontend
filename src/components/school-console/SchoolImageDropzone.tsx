"use client";

import { useState } from "react";
import { UploadCloud, X } from "lucide-react";

interface SchoolImageDropzoneProps {
    onImageSelect?: (file: File) => void;
}

export function SchoolImageDropzone({ onImageSelect }: SchoolImageDropzoneProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            if (onImageSelect) onImageSelect(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
    };

    return (
        <div className="w-full">
            <label className="group relative flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#088077]/40 bg-[#088077]/5 p-6 transition-all duration-200 hover:border-[#088077] hover:bg-[#088077]/10">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {preview ? (
                    <div className="relative flex flex-col items-center justify-center gap-2">
                        <img
                            src={preview}
                            alt="Preview da imagem selecionada"
                            className="max-h-36 rounded-lg object-cover shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -right-3 -top-3 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600 transition-transform hover:scale-110"
                            title="Remover imagem"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="rounded-full bg-[#088077]/15 p-3 text-[#088077] transition-transform group-hover:scale-110">
                            <UploadCloud size={28} />
                        </div>
                        <p className="text-sm font-medium text-[#088077]">
                            Campo para adicionar imagens e mostrar previews
                        </p>
                        <span className="text-xs text-gray-500">
                            Clique ou arraste um arquivo de imagem (PNG, JPG ou WEBP)
                        </span>
                    </div>
                )}
            </label>
        </div>
    );
}

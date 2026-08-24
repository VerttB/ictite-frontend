"use client";

import { UseFormReturn } from "react-hook-form";
import {
    School,
    MapPin,
    Building2,
    AlertCircle,
    Instagram,
    FileText,
} from "lucide-react";
import {
    SchoolFormDraftData,
    SchoolFormDataInput,
} from "@/schemas/schoolSubmissionSchema";

interface SchoolMainFieldsProps {
    form: UseFormReturn<SchoolFormDataInput>;
    readOnly?: boolean;
}

export function SchoolMainFields({ form, readOnly = false }: SchoolMainFieldsProps) {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 text-[#088077]">
                <School size={20} />
                <h3 className="text-base font-bold text-gray-800">
                    Dados Principais da Escola
                </h3>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Nome da Escola */}
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <School size={14} className="text-[#088077]" />
                        Nome da Escola *
                    </label>
                    <input
                        type="text"
                        disabled={readOnly}
                        placeholder="Ex: Escola Estadual Professor João da Silva"
                        {...register("school.name")}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-gray-100"
                    />
                    {errors.school?.name && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                            <AlertCircle size={12} />
                            {errors.school.name.message}
                        </p>
                    )}
                </div>

                {/* Cidade */}
                <div>
                    <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <MapPin size={14} className="text-[#088077]" />
                        Cidade
                    </label>
                    <input
                        type="text"
                        disabled={readOnly}
                        placeholder="Ex: Salvador"
                        {...register("school.city")}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-gray-100"
                    />
                </div>

                {/* CEP */}
                <div>
                    <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <Building2 size={14} className="text-[#088077]" />
                        CEP
                    </label>
                    <input
                        type="text"
                        disabled={readOnly}
                        maxLength={9}
                        placeholder="40000-000"
                        {...register("school.cep")}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-gray-100"
                    />
                </div>

                {/* URL do Instagram */}
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <Instagram size={14} className="text-[#088077]" />
                        Instagram da Escola (Opcional)
                    </label>
                    <input
                        type="url"
                        disabled={readOnly}
                        placeholder="https://instagram.com/escola_exemplo"
                        {...register("school.instagram_url")}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-gray-100"
                    />
                </div>

                {/* Descrição da Escola */}
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <FileText size={14} className="text-[#088077]" />
                        Descrição da Escola (Opcional)
                    </label>
                    <textarea
                        rows={3}
                        disabled={readOnly}
                        placeholder="Breve apresentação sobre o histórico, estrutura e valores da instituição de ensino..."
                        {...register("school.description")}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-gray-100"
                    />
                </div>
            </div>
        </div>
    );
}

"use client";

import { UseFormReturn } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { SchoolFormDraftData } from "@/schemas/schoolSubmissionSchema";

interface SchoolMainFieldsProps {
    form: UseFormReturn<SchoolFormDraftData>;
    readOnly?: boolean;
}

export function SchoolMainFields({ form, readOnly = false }: SchoolMainFieldsProps) {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800">Campos relacionados e outros</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nome da Escola *
                    </label>
                    <input
                        type="text"
                        placeholder="Nome"
                        disabled={readOnly}
                        {...register("school.name")}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {errors.school?.name && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                            <AlertCircle size={12} />
                            {errors.school.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tipo / Cidade
                    </label>
                    <input
                        type="text"
                        placeholder="Tipo ou Cidade da Escola"
                        disabled={readOnly}
                        {...register("school.city")}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                    CEP
                </label>
                <input
                    type="text"
                    maxLength={8}
                    placeholder="40000000"
                    disabled={readOnly}
                    {...register("school.cep")}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                />
            </div>
        </div>
    );
}

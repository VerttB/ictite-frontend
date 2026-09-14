"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, AlertCircle, X } from "lucide-react";
import {
    RequestDeadlineExtension,
    RequestDeadlineExtensionSchema,
} from "@/schemas/schoolSubmissionSchema";

interface RequestExtensionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RequestDeadlineExtension) => Promise<boolean | void>;
    isSubmitting?: boolean;
}

export function RequestExtensionModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
}: RequestExtensionModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RequestDeadlineExtension>({
        resolver: zodResolver(RequestDeadlineExtensionSchema),
    });

    if (!isOpen) return null;

    const handleFormSubmit = async (data: RequestDeadlineExtension) => {
        const isoDate = new Date(data.requested_deadline).toISOString();
        await onSubmit({ ...data, requested_deadline: isoDate });
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-card w-full max-w-lg rounded-2xl p-6 shadow-2xl transition-all">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-[#088077]">
                        <Clock size={22} />
                        <h3 className="text-lg font-semibold">Solicitar Prorrogação de Prazo</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-font-secondary rounded-full p-1 transition-colors hover:bg-muted hover:text-font-primary"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-4">
                    <div>
                        <label className="text-font-primary mb-1 block text-sm font-medium">
                            Nova Data Limite Desejada *
                        </label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                {...register("requested_deadline")}
                                className="bg-background text-font-primary w-full rounded-xl border border-border px-4 py-2.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20"
                            />
                        </div>
                        {errors.requested_deadline && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle size={12} />
                                {errors.requested_deadline.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-font-primary mb-1 block text-sm font-medium">
                            Justificativa do Pedido *
                        </label>
                        <textarea
                            rows={4}
                            {...register("reason")}
                            placeholder="Descreva o motivo pelo qual sua escola necessita de um novo prazo..."
                            className="bg-background text-font-primary placeholder:text-font-secondary w-full resize-none rounded-xl border border-border p-3 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20"
                        />
                        {errors.reason && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle size={12} />
                                {errors.reason.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-font-secondary rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-font-primary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-[#088077] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#088077]/90 transition-all shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

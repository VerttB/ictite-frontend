"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";

import {
    SchoolFormSubmission,
    SchoolFormDraftDataSchema,
    RequestDeadlineExtension,
    SchoolFormDataInput,
} from "@/schemas/schoolSubmissionSchema";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";
import z from "zod";

interface UseSchoolSubmissionReturn {
    submission: SchoolFormSubmission | null;
    isLoading: boolean;
    isSaving: boolean;
    isSubmitting: boolean;
    form: UseFormReturn<SchoolFormDataInput>;
    saveDraft: (options?: { quietSuccess?: boolean }) => Promise<boolean>;
    submitForm: () => Promise<boolean>;
    refreshFromDatabase: () => Promise<void>;
    reopenDraft: () => Promise<void>;
    requestDeadlineExtension: (payload: RequestDeadlineExtension) => Promise<boolean>;
    reloadSubmission: () => Promise<void>;
}

// Função provisória para resolver bug entre undefined e nulls, remove todos os nulls do objeto, para que o zod consiga validar corretamente.
function removeNulls<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(removeNulls) as unknown as T;
    }
    if (obj !== null && typeof obj === "object") {
        const cleaned = Object.entries(obj).reduce<Record<string, unknown>>((acc, [key, value]) => {
            acc[key] = value === null ? undefined : removeNulls(value);
            return acc;
        }, {});
        return cleaned as T;
    }
    return obj;
}

function getDraftValidationMessage(error: z.ZodError): string {
    const firstIssue = error.issues[0];
    if (!firstIssue) return "Preencha os campos obrigatórios para salvar o rascunho.";

    const path = firstIssue.path.join(" > ");
    if (path.includes("school.name")) {
        return "O nome da escola é obrigatório para salvar o rascunho.";
    }
    if (path.includes("clubs")) {
        return "Verifique os clubes de ciência: o nome do clube é obrigatório.";
    }
    if (path.includes("projects")) {
        return "Verifique os projetos: nome e vínculo com clube são obrigatórios.";
    }
    if (path.includes("researchers")) {
        return "Verifique os pesquisadores: nome e função são obrigatórios.";
    }
    if (path.includes("equipments")) {
        return "Verifique a quantidade dos equipamentos: deve ser maior ou igual a 1.";
    }
    return `Erro de validação: ${firstIssue.message}`;
}

export function useSchoolSubmission(): UseSchoolSubmissionReturn {
    const [submission, setSubmission] = useState<SchoolFormSubmission | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<SchoolFormDataInput>({
        resolver: zodResolver(SchoolFormDraftDataSchema),
        defaultValues: {
            school: { name: "", city: "", cep: "", description: "", instagram_url: "" },
            clubs: [],
            projects: [],
            researchers: [],
            equipments: [],
        },
    });

    const loadSubmission = useCallback(async () => {
        setIsLoading(true);
        try {
            const sub = await schoolSubmissionService.getCurrentSubmission();
            setSubmission(sub);
            if (sub && sub.data) {
                form.reset(sub.data);
            }
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                try {
                    const latestSub = await schoolSubmissionService.getLatestSubmission();
                    setSubmission(latestSub);
                    if (latestSub && latestSub.data) {
                        form.reset(latestSub.data);
                    }
                } catch (latestError) {
                    if (latestError instanceof ApiError && latestError.status === 404) {
                        try {
                            const newSub = await schoolSubmissionService.createDraft();
                            setSubmission(newSub);
                            if (newSub && newSub.data) {
                                form.reset(newSub.data);
                            }
                        } catch (_createErr) {
                            toast.error(
                                "Erro ao criar o rascunho inicial do formulário."
                            );
                        }
                    } else {
                        toast.error("Erro ao consultar a última submissão da escola.");
                    }
                }
            } else {
                toast.error("Erro ao carregar o formulário da escola.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [form]);

    useEffect(() => {
        loadSubmission();
    }, [loadSubmission]);

    const saveDraft = async (options?: { quietSuccess?: boolean }): Promise<boolean> => {
        if (!submission) return false;
        setIsSaving(true);
        try {
            const currentData = form.getValues();
            const cleanData = removeNulls(currentData);
            const validatedData = SchoolFormDraftDataSchema.parse(cleanData);
            const updatedSub = await schoolSubmissionService.saveDraft(
                submission.version,
                validatedData
            );
            setSubmission(updatedSub);
            form.reset(updatedSub.data);
            if (!options?.quietSuccess) toast.success("Rascunho salvo com sucesso!");
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 409) {
                    toast.error(
                        error.message || "Conflito de concorrência ou prazo encerrado."
                    );
                } else {
                    toast.error(error.message || "Erro ao salvar rascunho.");
                }
                return false;
            } else if (error instanceof z.ZodError) {
                await form.trigger();
                toast.error(getDraftValidationMessage(error));
                return false;
            } else {
                toast.error("Erro de conexão ao salvar rascunho.");
                console.log(error);
                return false;
            }
        } finally {
            setIsSaving(false);
        }
    };

    const submitForm = async (): Promise<boolean> => {
        if (!submission) return false;
        setIsSubmitting(true);
        try {
            const currentData = form.getValues();
            const cleanData = removeNulls(currentData);
            const validatedData = SchoolFormDraftDataSchema.parse(cleanData);
            await schoolSubmissionService.saveDraft(submission.version, validatedData);

            const submittedSub = await schoolSubmissionService.submitDraft();
            setSubmission(submittedSub);
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message || "Erro ao enviar formulário para aprovação.");
            } else {
                toast.error("Erro de conexão ao enviar formulário.");
            }
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const refreshFromDatabase = async () => {
        if (!submission) return;
        setIsLoading(true);
        try {
            const refreshedSub = await schoolSubmissionService.refreshDraft();
            setSubmission(refreshedSub);
            form.reset(refreshedSub.data);
            toast.success("Dados recarregados do banco principal!");
        } catch (_error) {
            toast.error("Erro ao recarregar dados do banco de dados.");
        } finally {
            setIsLoading(false);
        }
    };

    const reopenDraft = async () => {
        if (!submission) return;
        setIsLoading(true);
        try {
            const reopenedSub = await schoolSubmissionService.reopenDraft();
            setSubmission(reopenedSub);
            form.reset(reopenedSub.data);
            toast.success("Formulário reaberto para edição!");
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message || "Erro ao reabrir formulário.");
            } else {
                toast.error("Erro de conexão ao reabrir formulário.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const requestDeadlineExtension = async (
        payload: RequestDeadlineExtension
    ): Promise<boolean> => {
        if (!submission) return false;
        try {
            const updatedSub =
                await schoolSubmissionService.requestDeadlineExtension(payload);
            setSubmission(updatedSub);
            toast.success("Solicitação de prorrogação enviada com sucesso!");
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message || "Erro ao solicitar prorrogação.");
            } else {
                toast.error("Erro de conexão.");
            }
            return false;
        }
    };

    return {
        submission,
        isLoading,
        isSaving,
        isSubmitting,
        form,
        saveDraft,
        submitForm,
        refreshFromDatabase,
        reopenDraft,
        requestDeadlineExtension,
        reloadSubmission: loadSubmission,
    };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";

import {
    SchoolFormSubmission,
    SchoolFormDraftData,
    SchoolFormDraftDataSchema,
    RequestDeadlineExtension,
} from "@/schemas/schoolSubmissionSchema";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";

interface UseSchoolSubmissionReturn {
    submission: SchoolFormSubmission | null;
    isLoading: boolean;
    isSaving: boolean;
    isSubmitting: boolean;
    form: UseFormReturn<SchoolFormDraftData>;
    saveDraft: () => Promise<void>;
    submitForm: () => Promise<void>;
    refreshFromDatabase: () => Promise<void>;
    reopenDraft: () => Promise<void>;
    requestDeadlineExtension: (payload: RequestDeadlineExtension) => Promise<boolean>;
    reloadSubmission: () => Promise<void>;
}

export function useSchoolSubmission(): UseSchoolSubmissionReturn {
    const [submission, setSubmission] = useState<SchoolFormSubmission | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<SchoolFormDraftData>({
        resolver: zodResolver(SchoolFormDraftDataSchema),
        defaultValues: {
            school: { name: "", city: "", cep: "" },
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
                    const newSub = await schoolSubmissionService.createDraft();
                    setSubmission(newSub);
                    if (newSub && newSub.data) {
                        form.reset(newSub.data);
                    }
                } catch (_createErr) {
                    toast.error("Erro ao criar o rascunho inicial do formulário.");
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

    const saveDraft = async () => {
        if (!submission) return;
        setIsSaving(true);
        try {
            const currentData = form.getValues();
            const updatedSub = await schoolSubmissionService.saveDraft(
                submission.version,
                currentData
            );
            setSubmission(updatedSub);
            form.reset(updatedSub.data);
            toast.success("Rascunho salvo com sucesso!");
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 409) {
                    toast.error(error.message || "Conflito de concorrência ou prazo encerrado.");
                } else {
                    toast.error(error.message || "Erro ao salvar rascunho.");
                }
            } else {
                toast.error("Erro de conexão ao salvar rascunho.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const submitForm = async () => {
        if (!submission) return;
        setIsSubmitting(true);
        try {
            const currentData = form.getValues();
            await schoolSubmissionService.saveDraft(submission.version, currentData);

            const submittedSub = await schoolSubmissionService.submitDraft();
            setSubmission(submittedSub);
            toast.success("Formulário enviado com sucesso para aprovação!");
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message || "Erro ao enviar formulário para aprovação.");
            } else {
                toast.error("Erro de conexão ao enviar formulário.");
            }
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
        } catch (_error) {
            toast.error("Erro ao reabrir formulário.");
        } finally {
            setIsLoading(false);
        }
    };

    const requestDeadlineExtension = async (payload: RequestDeadlineExtension): Promise<boolean> => {
        if (!submission) return false;
        try {
            const updatedSub = await schoolSubmissionService.requestDeadlineExtension(payload);
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

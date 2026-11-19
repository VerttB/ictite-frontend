"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";

import {
    SchoolFormSubmission,
    SchoolFormDraftDataSchema,
    SchoolFormFinalDataSchema,
    RequestDeadlineExtension,
    SchoolFormDataInput,
} from "@/schemas/schoolSubmissionSchema";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";
import z from "zod";
import {
    getDraftValidationMessage,
    normalizeSchoolFormData,
} from "@/core/utils/schoolFormValidation";

interface UseSchoolSubmissionReturn {
    submission: SchoolFormSubmission | null;
    globalDeadline: string | null | undefined;
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

export function useSchoolSubmission(): UseSchoolSubmissionReturn {
    const initialLoadStarted = useRef(false);
    const [submission, setSubmission] = useState<SchoolFormSubmission | null>(null);
    const [globalDeadline, setGlobalDeadline] = useState<string | null | undefined>(
        undefined
    );
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
        const deadlineRequest = schoolSubmissionService
            .getGlobalDeadline()
            .then(({ school_forms_global_deadline }) =>
                setGlobalDeadline(school_forms_global_deadline)
            )
            .catch(() => {
                setGlobalDeadline(undefined);
                toast.error("Não foi possível consultar o prazo de envio do formulário.");
            });
        try {
            const sub = await schoolSubmissionService.getCurrentSubmission();
            setSubmission(sub);
            if (sub && sub.data) {
                form.reset(normalizeSchoolFormData(sub.data));
            }
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                try {
                    const latestSub = await schoolSubmissionService.getLatestSubmission();
                    setSubmission(latestSub);
                    if (latestSub && latestSub.data) {
                        form.reset(normalizeSchoolFormData(latestSub.data));
                    }
                } catch (latestError) {
                    if (latestError instanceof ApiError && latestError.status === 404) {
                        try {
                            const newSub = await schoolSubmissionService.createDraft();
                            setSubmission(newSub);
                            if (newSub && newSub.data) {
                                form.reset(normalizeSchoolFormData(newSub.data));
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
            await deadlineRequest;
            setIsLoading(false);
        }
    }, [form]);

    useEffect(() => {
        if (initialLoadStarted.current) return;
        initialLoadStarted.current = true;
        void loadSubmission();
    }, [loadSubmission]);

    const saveDraft = async (options?: { quietSuccess?: boolean }): Promise<boolean> => {
        if (!submission) return false;
        setIsSaving(true);
        try {
            const currentData = form.getValues();
            const cleanData = normalizeSchoolFormData(currentData);
            const validatedData = SchoolFormDraftDataSchema.parse(cleanData);
            const updatedSub = await schoolSubmissionService.saveDraft(
                submission.version,
                validatedData
            );
            setSubmission(updatedSub);
            form.reset(normalizeSchoolFormData(updatedSub.data));
            if (!options?.quietSuccess) toast.success("Rascunho salvo com sucesso!");
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 409) {
                    toast.error(
                        error.message || "Conflito de concorrência ou prazo encerrado."
                    );
                } else if (error.status === 422) {
                    toast.error(
                        "Confira os dados do formulário antes de salvar o rascunho."
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
            const cleanData = normalizeSchoolFormData(currentData);
            const validatedData = SchoolFormFinalDataSchema.parse(cleanData);
            const updatedDraft = await schoolSubmissionService.saveDraft(
                submission.version,
                validatedData
            );
            setSubmission(updatedDraft);
            form.reset(normalizeSchoolFormData(updatedDraft.data));

            const submittedSub = await schoolSubmissionService.submitDraft();
            setSubmission(submittedSub);
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(
                    error.status === 422
                        ? "Confira os dados do formulário antes de enviar para aprovação."
                        : error.message || "Erro ao enviar formulário para aprovação."
                );
            } else if (error instanceof z.ZodError) {
                await form.trigger();
                toast.error(getDraftValidationMessage(error));
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
            form.reset(normalizeSchoolFormData(refreshedSub.data));
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
            form.reset(normalizeSchoolFormData(reopenedSub.data));
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
        globalDeadline,
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

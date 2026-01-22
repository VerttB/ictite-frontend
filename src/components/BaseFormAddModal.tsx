"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FieldValues, FormProvider, useForm, type UseFormProps } from "react-hook-form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ReactNode } from "react";
import * as z from "zod";
import { LoaderCircle } from "lucide-react";

interface BaseFormModalProps<T extends z.ZodType<FieldValues, FieldValues>, TContext> {
    open: boolean;
    onClose: () => void;
    title: string;
    schema: T;
    props?: Omit<UseFormProps<z.input<T>, TContext, z.output<T>>, "resolver">;
    onSubmit: (data: z.infer<T>) => Promise<void>;
    children: ReactNode;
}

export function BaseFormModal<T extends z.ZodType<FieldValues, FieldValues>, TContext>({
    open,
    onClose,
    title,
    schema,
    props,
    onSubmit,
    children,
}: BaseFormModalProps<T, TContext>) {
    const [tab, setTab] = useState("manual");
    const [arquivo, setArquivo] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const methods = useForm({
        resolver: zodResolver(schema),
        ...props,
    });
    const {
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = methods;

    const handleManualSubmit = async (data: z.infer<T>) => {
        await onSubmit(data);
        reset();
        onClose();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files?.length) return;

        const file = files[0];
        const ext = file.name.split(".").pop()?.toLowerCase();

        if (ext !== "csv" && ext !== "xlsx") {
            toast.error("Formato inválido. Use .csv ou .xlsx");
            return;
        }

        setArquivo(file);
    };

    return (
        <Dialog open={open} onOpenChange={(s) => !s && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="mb-4 grid grid-cols-2">
                        <TabsTrigger value="manual" className="text-font-primary">
                            Adicionar manualmente
                        </TabsTrigger>
                        <TabsTrigger value="importar" className="text-font-primary">
                            Importar arquivo
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual">
                        <FormProvider {...methods}>
                            <form
                                onSubmit={handleSubmit(handleManualSubmit)}
                                className="mt-2 space-y-4">
                                {children}

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => {
                                            reset();
                                            onClose();
                                        }}>
                                        Cancelar
                                    </Button>

                                    <Button
                                        className="w-20"
                                        type="submit"
                                        disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <LoaderCircle className="animate-spin" />
                                        ) : (
                                            "Salvar"
                                        )}
                                    </Button>
                                </div>
                                {errors && Object.keys(errors).length > 0 && (
                                    <p className="text-sm text-red-500">
                                        Por favor, corrija os erros acima.
                                    </p>
                                )}
                            </form>
                        </FormProvider>
                    </TabsContent>

                    <TabsContent value="importar">
                        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                            <p className="mb-3 text-sm text-gray-600">
                                Envie um arquivo <strong>.csv</strong> ou{" "}
                                <strong>.xlsx</strong>
                            </p>

                            <Input
                                type="file"
                                accept=".csv, .xlsx"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />

                            {arquivo && (
                                <p className="mt-2 text-xs text-green-700">
                                    Arquivo selecionado: {arquivo.name}
                                </p>
                            )}

                            <Button
                                className="mt-4"
                                onClick={() => {
                                    if (!arquivo)
                                        return toast.error("Selecione um arquivo");
                                    toast.success("Import funcionalidade futura");
                                }}>
                                Importar
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

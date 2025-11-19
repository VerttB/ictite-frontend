"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FieldValues, FormProvider, useForm, type UseFormProps } from "react-hook-form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ReactNode } from "react";
import * as z from "zod";

interface BaseFormModalProps<T extends z.ZodType<FieldValues, FieldValues>, TContext> {
  open: boolean;
  onClose: () => void;
  title: string;
  schema: T;
  props?: Omit<UseFormProps<z.input<T>, TContext, z.output<T>>, 'resolver'>
  onSubmit: (data: z.infer<T>) => void;
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
    ...props
  });
  const {
    handleSubmit,
    reset,
  } = methods;

  const handleManualSubmit = (data: z.infer<T>) => {
    console.log(data)
    onSubmit(data);
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
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="manual">Adicionar manualmente</TabsTrigger>
            <TabsTrigger value="importar">Importar arquivo</TabsTrigger>
          </TabsList>

          {/* ----------- FORM TAB ----------- */}
          <TabsContent value="manual">
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(handleManualSubmit)}
                className="space-y-4 mt-2"
              >
                {children}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      reset();
                      onClose();
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </FormProvider>
          </TabsContent>

          {/* ----------- IMPORT TAB ----------- */}
          <TabsContent value="importar">
            <div className="mt-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              <p className="text-sm mb-3 text-gray-600">
                Envie um arquivo <strong>.csv</strong> ou <strong>.xlsx</strong>
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
                  if (!arquivo) return toast.error("Selecione um arquivo");
                  // você implementa o import depois
                  toast.success("Import funcionalidade futura");
                }}
              >
                Importar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

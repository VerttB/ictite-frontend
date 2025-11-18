"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ClubeSchema, ClubeType } from "@/schemas/ClubeSchema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectLabel } from "@radix-ui/react-select";
import { SchoolData } from "@/core/interface/School";
import { ImageUploadInput } from "../ImageInput";

interface ClubeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClubeType) => void;
  escolas: Pick<SchoolData, "id" | "name">[];
}

export function ClubeAddModal({ open, onClose, onSubmit, escolas }: ClubeModalProps) {
  const [tab, setTab] = useState("manual");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<ClubeType>({
    resolver: zodResolver(ClubeSchema),
    defaultValues:{
      images: []
    }
  });

  const handleManualSubmit = (data: ClubeType) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension !== 'csv' && extension !== 'xlsx') {
      toast.error("Formato não suportado. Use CSV ou XLSX.");
      return;
    }

    setArquivo(file);

  };

  const handleRemoveFile = () => {
    setArquivo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Material</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 mb-4 ">
            <TabsTrigger className="text-font-primary " value="manual">Adicionar manualmente</TabsTrigger>
            <TabsTrigger className="text-font-primary " value="importar">Importar arquivo</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <form onSubmit={handleSubmit(handleManualSubmit)} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input
                  {...register("title")}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Escola</label>

                <Controller
                  control={control}
                  name="school_id"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a escola" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {escolas.map((escola) => (
                            <SelectItem key={escola.id} value={escola.id}>
                              {escola.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.school_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.school_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  {...register("description")}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
                <Controller
                      control={control}
                      name="images"
                      render={({field}) => (
                    <ImageUploadInput 
                                    label="Imagens"
                                    errors={errors.images?.message}
                                    multiple={false}
                                    value={field.value}
                                    onChange={field.onChange}
                                     />
                                     )}
                                    />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  className="px-4 py-2 text-sm "
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-sm"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="importar">
            <div className="mt-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              <p className="text-sm mb-3 text-gray-600">
                Faça upload de um arquivo <strong>.csv</strong> ou <strong>.xlsx</strong>
              </p>
              <Input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileSelect}
                className="text-sm text-gray-700"
              />
              {arquivo && (
                <p className="mt-2 text-xs text-green-700">Arquivo: {arquivo.name}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
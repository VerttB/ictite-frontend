"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SchoolData } from "@/core/interface/School";
import { PesquisadorSchema, PesquisadorType } from "@/schemas/PesquisadorSchema";
import { RaceTypes } from "@/core/constants/race";
import { SexTypes } from "@/core/constants/sex";
import { ResearcherTypes } from "@/core/constants/researcherType";

interface PesquisadorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PesquisadorType) => void;
  escolas: Pick<SchoolData, "id" | "name">[];
}

export function PesquisadorAddModal({ open, onClose, onSubmit, escolas }: PesquisadorModalProps) {
  const [tab, setTab] = useState("manual");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<PesquisadorType>({
    resolver: zodResolver(PesquisadorSchema),
    
  });
  const handleManualSubmit = (data: PesquisadorType) => {
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
                <label className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  {...register("name")}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
            <div className="flex gap-2 w-full">
             <div>
                <label className="block text-sm font-medium mb-1">Lattes</label>
                <Input
                  {...register("lattes")}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400"
                />
                {errors.lattes && (
                  <p className="text-red-500 text-sm mt-1">{errors.lattes.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>

                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {Object.values(ResearcherTypes).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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
                      <SelectTrigger className="w-full">
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
              <div className="flex gap-2 w-full">
             <div>
                <label className="block text-sm font-medium mb-1">Raça</label>
                
                <Controller
                  control={control}
                  name="race"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Raça" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {Object.values(RaceTypes).map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.race && (
                  <p className="text-red-500 text-sm mt-1">{errors.race.message}</p>
                )}
              </div>
               <div>
                <label className="block text-sm font-medium mb-1">Sexo</label>
                
                <Controller
                  control={control}
                  name="sex"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {Object.values(SexTypes).map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.sex && (
                  <p className="text-red-500 text-sm mt-1">{errors.sex.message}</p>
                )}
              </div>
              </div>

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
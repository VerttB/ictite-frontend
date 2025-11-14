"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericItemFormData, genericItemSchema } from "@/schemas/GenericItemSchema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface MaterialModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GenericItemFormData) => void;
}

export function MaterialModal({ open, onClose, onSubmit }: MaterialModalProps) {
    const [tab, setTab] = useState("manual");
    const [arquivo, setArquivo] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    

  const { register, handleSubmit, formState: { errors }, reset } = useForm<GenericItemFormData>({
    resolver: zodResolver(genericItemSchema),
  });

   const handleManualSubmit = (data: GenericItemFormData) => {
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
                  {...register("titulo")}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400"
                />
                {errors.titulo && (
                  <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link</label>
                <Input
                  {...register("link")}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400"
                />
                {errors.link && (
                  <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  {...register("descricao")}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400"
                />
                {errors.descricao && (
                  <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
                )}
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
              <input
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
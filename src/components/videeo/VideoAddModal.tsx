"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericItemFormData, genericItemSchema } from "@/schemas/GenericItemSchema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GenericItemFormData) => void;
}

export function VideoAddModal({ open, onClose, onSubmit }: VideoModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<GenericItemFormData>({
    resolver: zodResolver(genericItemSchema),
  });

  const submitHandler = (data: GenericItemFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Video</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              {...register("titulo")}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Título do video"
            />
            {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link</label>
            <Input
              {...register("link")}
              className="w-full border rounded-md px-3 py-2"
              placeholder="https://..."
            />
            {errors.link && <p className="text-red-500 text-sm">{errors.link.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              {...register("descricao")}
              rows={3}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Descrição do video"
            />
            {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant={"destructive"}
              onClick={() => { reset(); onClose(); }}
              className="px-4 py-2 text-sm"
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
      </DialogContent>
    </Dialog>
  );
}

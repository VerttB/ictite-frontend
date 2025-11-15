"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericItemFormData, genericItemSchema } from "@/schemas/GenericItemSchema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RevistaSchema, RevistaType } from "@/schemas/RevistaSchema";

interface RevistaAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RevistaType) => void;
}

export function RevistaAddModal({ open, onClose, onSubmit }: RevistaAddModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RevistaType>({
    resolver: zodResolver(RevistaSchema),
  });

  const submitHandler = (data: RevistaType) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Revista</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              {...register("title")}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Título da revista"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
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
              {...register("description")}
              rows={3}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Descrição da revista"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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

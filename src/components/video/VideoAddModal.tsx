"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    GenericItemFormData,
    genericItemSchema,
} from "@/schemas/GenericItemSchema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { VideoSchema, VideoType } from "@/schemas/VideoSchema";

interface VideoModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: VideoType) => void;
}

export function VideoAddModal({ open, onClose, onSubmit }: VideoModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<VideoType>({
        resolver: zodResolver(VideoSchema),
    });

    const submitHandler = (data: VideoType) => {
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

                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="mt-4 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Título
                        </label>
                        <input
                            {...register("title")}
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="Título do video"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Link
                        </label>
                        <Input
                            {...register("link")}
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="https://..."
                        />
                        {errors.link && (
                            <p className="text-sm text-red-500">
                                {errors.link.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Descrição
                        </label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="Descrição do video"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description.message}
                            </p>
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
                            className="px-4 py-2 text-sm">
                            Cancelar
                        </Button>
                        <Button type="submit" className="px-4 py-2 text-sm">
                            Salvar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

'use client';
import { useState } from "react";
import { Section } from "../Section"
import { VideoAddModal } from "../video/VideoAddModal"
import { BaseFormModal } from "../BaseFormAddModal";
import { VideoSchema } from "@/schemas/VideoSchema";

export const VideoAdm = () => {
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: any) => {
        console.log(data);
    }
    return (
        <>
        <Section title="Vídeos" items={[]} onAdd={() => setOpen(true)}/>
        {/* <BaseFormModal schema={VideoSchema} open={open} onClose={() => setOpen(false)} onSubmit={onSubmit}
        title="Adicionar Video" /> */}
        </>
    )
}
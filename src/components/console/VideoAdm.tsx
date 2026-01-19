"use client";
import { useState } from "react";
import { Section } from "../Section";

export const VideoAdm = () => {
    const [, setOpen] = useState(false);

    return (
        <>
            <Section title="Vídeos" items={[]} onAdd={() => setOpen(true)} />
            {/* <BaseFormModal schema={VideoSchema} open={open} onClose={() => setOpen(false)} onSubmit={onSubmit}
        title="Adicionar Video" /> */}
        </>
    );
};

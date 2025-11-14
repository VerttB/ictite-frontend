'use client';
import { useState } from "react";
import { Section } from "../Section"
import { VideoAddModal } from "../videeo/VideoAddModal"

export const VideoAdm = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
        <Section title="Vídeos" items={[]} onAdd={() => setOpen(true)}/>
        <VideoAddModal open={open} onClose={() => setOpen(false)} onSubmit={(data) => console.log(data)} />
        </>
    )
}
'use client';
import { useState } from "react";
import { Section } from "../Section"
import { RevistaAddModal } from "../revista/RevistaAddModal";

export const RevistaAdm = () => {
    const [open, setOpen] = useState(false);
    
    return (
        <>
        <Section title="Revistas" items={[]} onAdd={() => setOpen(true)}/>
        <RevistaAddModal open={open} onClose={() => setOpen(false)} onSubmit={(data) => console.log(data)} />
        </>
    )
}
'use client'
import { useState } from "react";
import { Section } from "../Section"
import { MaterialModal } from "../material/MaterialAddModal";


export const MaterialAdm = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
        <Section title="Materiais" items={[]} onAdd={() => setOpen(true)}/>
        <MaterialModal open={open} onClose={() => setOpen(false)} onSubmit={(data) => console.log(data)} />
            </>

)
}
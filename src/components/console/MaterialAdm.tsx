'use client'
import { useState } from "react";
import { Section } from "../Section"
import { MaterialModal } from "../material/MaterialAddModal";
import { BookOpenCheck } from "lucide-react";
import useSWR from "swr";

import { createMaterial, getMaterials } from "@/core/service/MaterialService";
import { MaterialType } from "@/schemas/MaterialSchema";
const initialMaterialData = [{
  title: "Teste 1",
  image: "https://images.unsplash.com/photo-1761838816945-021a4ebd67bc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
},
{
  title: "Teste 2",
  image: "https://images.unsplash.com/photo-1761838816945-021a4ebd67bc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}, {
    title: "Teste 3",
    image: "https://images.unsplash.com/photo-1761838816945-021a4ebd67bc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}];

export const MaterialAdm = () => {
    const {data: materials, isLoading, mutate} = useSWR("materials", getMaterials)
    const [open, setOpen] = useState(false);

    const onSubmit = async (newMaterial: MaterialType) => {
        await createMaterial(newMaterial);
        mutate();
    }
    console.log("Materiais:", materials);
    return (
        <>
        <Section 
                title="Materiais"
                items={materials ?? []}
                onAdd={() => setOpen(true)}
                icon={<BookOpenCheck />}
        />
        <MaterialModal open={open} onClose={() => setOpen(false)} onSubmit={onSubmit} />
            </>

)
}
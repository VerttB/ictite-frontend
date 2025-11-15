'use client';
import { useState } from "react";
import { Section } from "../Section"
import { RevistaAddModal } from "../revista/RevistaAddModal";
import { RevistaType } from "@/schemas/RevistaSchema";
import { createRevista, getRevistas } from "@/core/service/RevistaService";
import { Book } from "lucide-react";
import useSWR from "swr";

export const RevistaAdm = () => {
     const {data: revistas, isLoading, mutate} = useSWR("revistas", getRevistas)
    const [open, setOpen] = useState(false);

    const onSubmit = async (newRevista: RevistaType) => {
        await createRevista(newRevista);
        mutate();
    }
    
    return (
        <>
        <Section 
                title="Revistas"
                items={revistas || []}
                onAdd={() => setOpen(true)}
                icon={<Book />}
        />
        <RevistaAddModal open={open} onClose={() => setOpen(false)} onSubmit={onSubmit} />
        </>
    )
}
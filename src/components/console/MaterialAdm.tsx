'use client'
import { useState } from "react";
import { Section } from "../Section"
import { MaterialModal } from "../material/MaterialAddModal";
import { BookOpenCheck } from "lucide-react";
import useSWR from "swr";

import { createMaterial, getMaterials } from "@/core/service/MaterialService";
import { MaterialSchema, MaterialType } from "@/schemas/MaterialSchema";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import { InputField } from "../ui/FormInputField";
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

    const onSubmit = async (data: MaterialType) => {
        const newMaterial = new FormData()
        newMaterial.append("title", data.title);
        newMaterial.append("description", data.description);
        newMaterial.append("link", data.link);
        data.images.forEach((file) => newMaterial.append("images", file));
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
        <BaseFormModal<typeof MaterialSchema, MaterialType>
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        title="Adicionar Material"
        schema={MaterialSchema}
        props={{ defaultValues: {images: []}}}
        >
        <InputField name="title" label="Título do Material" />
        <InputField name="description" label="Descrição" />
        <InputField name="link" label="Link" />
        <ControlledImageUpload name="images" />
        </BaseFormModal>
            </>

)
}
"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { getProjects , createProject} from "@/core/service/ProjetoService";
import { ProjetoSchema, ProjetoType } from "@/schemas/ProjetoSchema";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../ui/FormInputField";
import { ControlledSelect } from "../ui/ControlledSelect";
import { ControlledImageUpload } from "../ui/ControlledImageInput";

export const ProjetoAdm = () => {

  const { data: projetos, isLoading, mutate } = useSWR(
    "projetos",
    () => getProjects()
  );

  const { data: escolas } = useSWR("escolas", () => getSchools());
  const [open, setOpen] = useState(false);
  const onSubmit = async (data: ProjetoType) => {
    const form = new FormData()
    form.append("name", data.name);
    form.append("description", data.description);
    form.append("school_id", data.school_id);
    data.images.forEach((file) => form.append("images", file));
    console.log("data project", data);
    await createProject(form);
    mutate();      
    setOpen(false); 
  };

  if (!projetos) return null;
  return (
    <>
      <Section
        title="Projetos"
        items={projetos}
        icon={null}
        onAdd={() => setOpen(true)}
      />

      <BaseFormModal<typeof ProjetoSchema, ProjetoType>
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        title="Adicionar Projeto"
        schema={ProjetoSchema}
        props={{ defaultValues: { images: [] } }}>

          <InputField name="name" label="Nome do Projeto" />
          <InputField name="description" label="Descrição" />
          <ControlledSelect className="w-full" name="school_id" label="Escola" options={escolas || []} />
          <ControlledImageUpload  name="images" />
      </BaseFormModal>
          
    </>
  );
};

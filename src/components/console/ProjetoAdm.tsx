"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { ProjetoAddModal } from "../projeto/ProjedoAddModal";
import { getProjects , createProject} from "@/core/service/ProjetoService";
import { ProjetoType } from "@/schemas/ProjetoSchema";

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

      <ProjetoAddModal
        open={open}
        onClose={() => setOpen(false)}
        escolas={escolas ?? []}
        onSubmit={onSubmit}
      />
    </>
  );
};

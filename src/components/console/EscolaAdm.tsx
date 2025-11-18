"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { createSchool, getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { EscolaType } from "@/schemas/EscolaSchema";
import { EscolaAddModal } from "../escola/EscolaAddModal";
import { School } from "lucide-react";

export const EscolaAdm = () => {

  const { data: escolas, mutate } = useSWR("escolas", () => getSchools());
  const [open, setOpen] = useState(false);
  const onSubmit = async (data: EscolaType) => {
    const form = new FormData()
    form.append("name", data.name);
    form.append("description", data.description);
    form.append("cep", data.cep);
    data.images.forEach((file) => form.append("images", file));

    await createSchool(form);
    mutate();      
    setOpen(false); 
  };

  if (!escolas) return null;
  return (
    <>
      <Section
        title="Escolas"
        items={escolas}
        icon={<School />}
        onAdd={() => setOpen(true)}
      />

      <EscolaAddModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
      />
    </>
  );
};

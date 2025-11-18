"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { PersonStanding } from "lucide-react";
import { createResearcher, getResearchers } from "@/core/service/PesquisadorService";
import { PesquisadorType } from "@/schemas/PesquisadorSchema";
import { PesquisadorAddModal } from "../pesquisador/PesquisadorAddModal";
export const PesquisadorAdm = () => {

  const { data: pesquisadores, isLoading, mutate } = useSWR(
    "pesquisadores",
    () => getResearchers("")
  );

  const { data: escolas } = useSWR("escolas", () => getSchools());
  const [open, setOpen] = useState(false);
  const onSubmit = async (data: PesquisadorType) => {
   
    await createResearcher(data);
    mutate();      
    setOpen(false); 
  };
  console.log("pesquisadores", pesquisadores);
  if (!pesquisadores) return null;
  return (
    <>
      <Section
        title="Pesquisadores"
        items={pesquisadores}
        icon={<PersonStanding />}
        onAdd={() => setOpen(true)}
      />

      <PesquisadorAddModal
        open={open}
        onClose={() => setOpen(false)}
        escolas={escolas || []}
        onSubmit={onSubmit}
      />
    </>
  );
};
    
"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { PersonStanding } from "lucide-react";
import { createResearcher, getResearchers } from "@/core/service/PesquisadorService";
import { PesquisadorSchema, PesquisadorType } from "@/schemas/PesquisadorSchema";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../ui/FormInputField";
import { ControlledSelect } from "../ui/ControlledSelect";
import { ResearcherTypes } from "@/core/constants/researcherType";
import { RaceTypes } from "@/core/constants/race";
import { SexTypes } from "@/core/constants/sex";
export const PesquisadorAdm = () => {

  const { data: pesquisadores, mutate } = useSWR(
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
      <BaseFormModal<typeof PesquisadorSchema, PesquisadorType>
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        title="Adicionar Pesquisador"
        schema={PesquisadorSchema}
      >
        <InputField name="name" label="Nome do Pesquisador" />
        <InputField name="lattes" label="Link do Lattes" />
        <div className="flex w-full gap-2">
          <ControlledSelect className="w-full" name="type" label="Tipo de Pesquisador" options={Object.values(ResearcherTypes)} />
          <ControlledSelect className="w-full" name="school_id" label="Escola" options={escolas || []} />
        </div>
        <div className="flex w-full gap-2">
          <ControlledSelect className="w-full" name="race" label="Raça" options={Object.values(RaceTypes)} />
          <ControlledSelect className="w-full" name="sex" label="Sexo" options={Object.values(SexTypes)} />
        </div>
      </BaseFormModal>

    </>
  );
};

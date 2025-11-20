"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { getClubesCiencia, createClubeCiencias } from "@/core/service/ClubeCienciaService";
import { useState } from "react";
import { ClubeSchema, ClubeType } from "@/schemas/ClubeSchema";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import { InputField } from "../ui/FormInputField";
import { ControlledSelect } from "../ui/ControlledSelect";

export const ClubeAdm = () => {

  const { data: clubes, isLoading, mutate } = useSWR(
    "clubes",
    () => getClubesCiencia()
  );

  const { data: escolas } = useSWR("escolas", () => getSchools());
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: ClubeType) => {
    const form = new FormData()
    form.append("title", data.title);
    form.append("description", data.description);
    form.append("school_id", data.school_id);
   data.images.forEach((file) => form.append("images", file));

    await createClubeCiencias(form);
    mutate();      
    setOpen(false); 
  };

  if (!clubes) return null;
  return (
    <>
      <Section
        title="Clubes de Ciências"
        items={clubes}
        icon={null}
        onAdd={() => setOpen(true)}
      />

      <BaseFormModal<typeof ClubeSchema, ClubeType>
        open={open}
        onClose={() => setOpen(false)}
        title="Adicionar Clube de Ciências"
        schema={ClubeSchema}
        props={{ defaultValues: { images: [] } }}
        onSubmit={onSubmit}
      >
          <InputField name="title" label="Nome do Clube de Ciências" />
          <InputField name="description" label="Descrição" />
          <ControlledSelect className="w-full" name="school_id" label="Escola" options={escolas || []} />
          <ControlledImageUpload  name="images" />
        </BaseFormModal>
    </>
  );
};

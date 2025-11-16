"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { getClubesCiencia, createClubeCiencias } from "@/core/service/ClubeCienciaService";
import { ClubeAddModal } from "../clubeCiencia/ClubeCienciaAddModal";
import { useState } from "react";
import { ClubeType } from "@/schemas/ClubeSchema";

export const ClubeAdm = () => {

  const { data: clubes, isLoading, mutate } = useSWR(
    "clubes",
    () => getClubesCiencia()
  );

  const { data: escolas } = useSWR("escolas", () => getSchools());
  console.log(escolas)
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

      <ClubeAddModal
        open={open}
        onClose={() => setOpen(false)}
        escolas={escolas ?? []}
        onSubmit={onSubmit}
      />
    </>
  );
};

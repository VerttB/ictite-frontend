"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { EquipmentType } from "@/schemas/EquipmentSchema";
import { createEquipament, getEquipaments } from "@/core/service/EquipamentoService";
import { getEquipamentTypes } from "@/core/service/TipoEquipamentoService";
import { EquipamentoAddModal } from "../equipamento/EquipamentoAddModal";

export const EquipamentoAdm = () => {

  const { data: equipamentos, isLoading, mutate } = useSWR(
    "equipamentos",
    () => getEquipaments()
  );

  const { data: escolas } = useSWR("escolas", () => getSchools());
  const { data: equipamentosTipos} = useSWR("equipamentos_tipos", () => getEquipamentTypes());
  const [open, setOpen] = useState(false);
  const onSubmit = async (data: EquipmentType) => {
    const form = new FormData()
    form.append("name", data.name);
    form.append("type_equipment_id", data.type_equipment_id);
    form.append("school_id", data.school_id);
    data.images.forEach((file) => form.append("images", file));

    await createEquipament(form);
    mutate();      
    setOpen(false); 
  };

  if (!equipamentos) return null;
  return (
    <>
      <Section
        title="Equipamentos"
        items={equipamentos}
        icon={null}
        onAdd={() => setOpen(true)}
      />

      <EquipamentoAddModal
        open={open}
        onClose={() => setOpen(false)}
        escolas={escolas ?? []}
        equipamentosTipos={equipamentosTipos ?? []}
        onSubmit={onSubmit}
      />
    </>
  );
};

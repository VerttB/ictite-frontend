"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { EquipmentType , EquipmentSchema} from "@/schemas/EquipmentSchema";
import { createEquipament, getEquipaments } from "@/core/service/EquipamentoService";
import { getEquipamentTypes } from "@/core/service/TipoEquipamentoService";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../ui/FormInputField";
import { ControlledSelect } from "../ui/ControlledSelect";
import { ControlledImageUpload } from "../ui/ControlledImageInput";

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

  if (!equipamentos || !equipamentosTipos || !escolas) return null;
  return (
    <>
      <Section
        title="Equipamentos"
        items={equipamentos}
        icon={null}
        onAdd={() => setOpen(true)}
        
      />

      <BaseFormModal<typeof EquipmentSchema, EquipmentType>
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        title="Adicionar Equipamento"
        schema={EquipmentSchema}
        props={{ defaultValues: {images: []}}}
        >
        <InputField name="name" label="Nome do Equipamento" />
        <ControlledSelect
          name="type_equipment_id"
          label="Tipo de Equipamento"
          options={equipamentosTipos}/>
        <ControlledSelect
          name="school_id"
          label="Escola"
          options={escolas}/>
        <ControlledImageUpload name="images" />
          
        </BaseFormModal>
        
     
    </>
  );
};

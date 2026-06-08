"use client";

import React from "react";
import { InputField } from "../../forms-input/InputField";
import { TextField } from "../../forms-input/TextField";
import { ControlledComboBox } from "../../forms-input/ControlledComboBox";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";
import useSWR from "swr";
import { getClubesCiencia, getClubeCienciaById } from "@/core/service/ClubeCienciaService";
import { AdminFormProps } from "@/core/interface/AdminEntity";
import { mask } from "@/lib/maskBuilder";

export const ProjectForm = ({ parentId, parentIdField }: AdminFormProps) => {
    const isClubLocked = parentIdField === "clube_ciencia_id" && !!parentId;

    const { data: clubes } = useSWR("clubes-all", () => getClubesCiencia());
    const { data: parentClub } = useSWR(isClubLocked ? ["club", parentId] : null, () => getClubeCienciaById(parentId!));

    const clubOptions = isClubLocked && parentClub ? [parentClub] : (clubes?.items || []);

    return (
        <>
            <InputField name="name" label="Nome do Projeto" />
            <TextField name="description" label="Descrição (Opcional)" />
            <TextField name="description_long" label="Descrição Longa (Opcional)" />
            
            <div className="grid grid-cols-2 gap-4">
                <InputField name="year" label="Ano (Opcional)" mask={mask.onlyDigits} />
                <ControlledComboBox
                    className="w-full"
                    name="clube_ciencia_id"
                    label="Clube de Ciência"
                    options={clubOptions}
                    disabled={isClubLocked}
                />
            </div>
            <ControlledImageUpload
                name="images"
                label="Imagens (Opcional)"
                multiple={true}
            />
        </>
    );
};

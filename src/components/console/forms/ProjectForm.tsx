"use client";

import { InputField } from "../../forms-input/InputField";
import { TextField } from "../../forms-input/TextField";
import { ControlledComboBox } from "../../forms-input/ControlledComboBox";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";
import useSWR from "swr";
import {
    getClubesCiencia,
    getClubeCienciaById,
} from "@/core/service/ClubeCienciaService";
import { AdminFormProps } from "@/core/interface/AdminEntity";
import { mask } from "@/lib/maskBuilder";

export const ProjectForm = ({ parentId, parentIdField }: AdminFormProps) => {
    const isClubLocked = parentIdField === "clube_ciencia_id" && !!parentId;

    const { data: clubes } = useSWR("clubes-all", () => getClubesCiencia({ size: 0 }));
    const { data: parentClub } = useSWR(isClubLocked ? ["club", parentId] : null, () =>
        getClubeCienciaById(parentId!)
    );

    const clubOptions = isClubLocked && parentClub ? [parentClub] : clubes?.items || [];

    return (
        <>
            <InputField name="name" label="Nome do Projeto" />
            <TextField name="description" label="Descrição (Opcional)" />
            <TextField name="description_long" label="Descrição Longa (Opcional)" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <InputField name="start_year" label="Ano de início" mask={mask.onlyDigits} maxLength={4} />
                <InputField name="end_year" label="Ano previsto de conclusão" mask={mask.onlyDigits} maxLength={4} />
                <ControlledComboBox
                    className="w-full"
                    name="clube_ciencia_id"
                    label="Clube de Ciência"
                    options={clubOptions}
                    disabled={isClubLocked}
                    lockedValue={
                        isClubLocked && parentClub
                            ? {
                                  value: parentClub.id.toString(),
                                  label: parentClub.name,
                              }
                            : null
                    }
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

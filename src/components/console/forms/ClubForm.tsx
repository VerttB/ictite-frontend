"use client";

import { InputField } from "../../forms-input/InputField";
import { TextField } from "../../forms-input/TextField";
import { ControlledComboBox } from "../../forms-input/ControlledComboBox";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";
import useSWR from "swr";
import { getSchools, getSchoolById } from "@/core/service/SchoolService";
import { AdminFormProps } from "@/core/interface/AdminEntity";

export const ClubForm = ({ parentId, parentIdField }: AdminFormProps) => {
    const isSchoolLocked = parentIdField === "school_id" && !!parentId;

    const { data: schools, error: schoolsError, isLoading: schoolsLoading, mutate: reloadSchools } = useSWR(
        "schools-all", () => getSchools({ size: 0 })
    );

    const { data: parentSchool } = useSWR(
        isSchoolLocked ? ["school", parentId] : null,
        () => getSchoolById(parentId!)
    );

    const schoolOptions =
        isSchoolLocked && parentSchool ? [parentSchool] : schools?.items || [];

    return (
        <>
            <InputField name="name" label="Nome do Clube de Ciências" />
            <TextField name="description" label="Descrição (Opcional)" />
            <div className="grid grid-cols-2 gap-4">
                <ControlledComboBox
                    className="w-full"
                    name="school_id"
                    label="Escola (Obrigatório)"
                    options={schoolOptions}
                    disabled={isSchoolLocked}
                    lockedValue={
                        isSchoolLocked && parentSchool
                            ? {
                                  value: parentSchool.id.toString(),
                                  label: parentSchool.name,
                              }
                            : null
                    }
                />
                {schoolsLoading && <p className="text-font-secondary text-xs">Carregando escolas...</p>}
                {schoolsError && <button type="button" className="text-destructive text-xs underline" onClick={() => void reloadSchools()}>Não foi possível carregar as escolas. Tentar novamente</button>}
                {!schoolsLoading && !schoolsError && schoolOptions.length === 0 && <p className="text-font-secondary text-xs">Nenhuma escola disponível.</p>}
                <InputField name="instagram" label="Instagram (Opcional)" />
            </div>

            <ControlledImageUpload
                name="images"
                label="Imagens (Opcional)"
                multiple={true}
            />
        </>
    );
};

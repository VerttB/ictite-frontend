"use client";

import React from "react";
import { InputField } from "../../forms-input/InputField";
import { TextField } from "../../forms-input/TextField";
import { ControlledComboBox } from "../../forms-input/ControlledComboBox";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";
import useSWR from "swr";
import { getSchools, getSchoolById } from "@/core/service/SchoolService";
import { getCoordinators } from "@/core/service/CoordinatorService";
import { AdminFormProps } from "@/core/interface/AdminEntity";

export const ClubForm = ({ parentId, parentIdField }: AdminFormProps) => {
    const isSchoolLocked = parentIdField === "school_id" && !!parentId;

    const { data: schools } = useSWR("schools-all", () => getSchools({ size: 0 }));
    const { data: coordinators } = useSWR("coordinators-all", () => getCoordinators({ size: 0 }));
    const { data: parentSchool } = useSWR(isSchoolLocked ? ["school", parentId] : null, () => getSchoolById(parentId!));

    const schoolOptions = isSchoolLocked && parentSchool ? [parentSchool] : (schools?.items || []);

    return (
        <>
            <InputField name="name" label="Nome do Clube de Ciências" />
            <TextField name="description" label="Descrição (Opcional)" />
            <div className="grid grid-cols-2 gap-4">
                <ControlledComboBox
                    className="w-full"
                    name="school_id"
                    label="Escola"
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
                <InputField name="instagram" label="Instagram (Opcional)" />
            </div>
            <ControlledComboBox
                className="w-full"
                name="coordinators_ids"
                label="Coordenadores (Opcional)"
                isMulti={true}
                truncateLabels={true}
                options={coordinators?.items || []}
            />
            <ControlledImageUpload
                name="images"
                label="Imagens (Opcional)"
                multiple={true}
            />
        </>
    );
};

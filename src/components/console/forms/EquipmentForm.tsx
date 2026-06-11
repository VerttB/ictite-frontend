"use client";

import { InputField } from "../../forms-input/InputField";
import { ControlledComboBox } from "../../forms-input/ControlledComboBox";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";
import useSWR from "swr";
import { getSchools, getSchoolById } from "@/core/service/SchoolService";
import { getEquipamentTypes } from "@/core/service/TipoEquipamentoService";
import { AdminFormProps } from "@/core/interface/AdminEntity";

export const EquipmentForm = ({ parentId, parentIdField }: AdminFormProps) => {
    const isSchoolLocked = parentIdField === "school_id" && !!parentId;

    const { data: schools } = useSWR("schools-all", () => getSchools({ size: 0 }));
    const { data: types } = useSWR("types-equipment-all", () => getEquipamentTypes());
    const { data: parentSchool } = useSWR(
        isSchoolLocked ? ["school", parentId] : null,
        () => getSchoolById(parentId!)
    );

    const schoolOptions =
        isSchoolLocked && parentSchool ? [parentSchool] : schools?.items || [];

    return (
        <>
            <InputField name="name" label="Nome do Equipamento" />
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
                <ControlledComboBox
                    className="w-full"
                    name="type_equipment_id"
                    label="Tipo de Equipamento"
                    options={types || []}
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

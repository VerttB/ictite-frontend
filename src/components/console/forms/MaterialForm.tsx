"use client";

import React from "react";
import { InputField } from "../../forms-input/InputField";
import { TextField } from "../../forms-input/TextField";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";

import { ControlledSelect } from "../../forms-input/ControlledSelect";
import { MaterialType } from "@/core/constants/materialType";

export const MaterialForm = () => {
    return (
        <>
            <InputField name="name" label="Nome do Material" />
            <TextField name="description" label="Descrição" />
            <InputField name="link" label="Link Externo" />
            <ControlledSelect
                name="type"
                label="Tipo de Material"
                options={Object.values(MaterialType).map((t) => ({ id: t, name: t }))}
            />
            <ControlledImageUpload
                name="images"
                label="Imagens (Opcional)"
                multiple={true}
            />
        </>
    );
};

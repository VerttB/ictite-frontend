"use client";

import React from "react";
import { InputField } from "../../forms-input/InputField";
import { TextField } from "../../forms-input/TextField";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";

export const MaterialForm = () => {
    return (
        <>
            <InputField name="name" label="Nome do Material" />
            <TextField name="description" label="Descrição" />
            <InputField name="link" label="Link Externo" />
            <ControlledImageUpload
                name="images"
                label="Imagens (Opcional)"
                multiple={true}
            />
        </>
    );
};

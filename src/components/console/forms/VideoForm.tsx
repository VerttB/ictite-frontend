"use client";

import React from "react";
import { InputField } from "../../forms-input/InputField";
import { TextField } from "../../forms-input/TextField";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";

export const VideoForm = () => {
    return (
        <>
            <InputField name="name" label="Título do Vídeo" />
            <TextField name="description" label="Descrição" />
            <InputField name="link" label="Link do Vídeo" />
            <ControlledImageUpload
                name="images"
                label="Capa do Vídeo (Opcional)"
                multiple={false}
            />
        </>
    );
};

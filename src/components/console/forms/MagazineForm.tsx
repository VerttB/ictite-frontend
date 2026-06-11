"use client";

import { InputField } from "../../forms-input/InputField";
import { TextField } from "../../forms-input/TextField";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";

export const MagazineForm = () => {
    return (
        <>
            <InputField name="name" label="Título da Revista" />
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

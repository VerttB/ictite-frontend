"use client";

import { InputField } from "../../forms-input/InputField";
import { TextField } from "../../forms-input/TextField";
import { ControlledComboBox } from "../../forms-input/ControlledComboBox";
import { ControlledImageUpload } from "../../forms-input/ControlledImageInput";
import { mask } from "@/lib/maskBuilder";
import useSWR from "swr";
import { getTerritories } from "@/core/service/IdentityTerritoryService";

export const SchoolForm = () => {
    const { data: territories } = useSWR("territories", () => getTerritories());
    const normalizedTerritories = territories?.map((territory) => ({
        name: `${territory.code} - ${territory.name}`,
        id: territory.id,
    }));
    return (
        <>
            <InputField name="name" label="Nome da Escola" />
            <TextField name="description" label="Descrição (Opcional)" />
            <div className="grid grid-cols-2 gap-4">
                <InputField name="cep" label="CEP (Opcional)" mask={mask.cep} />
                <InputField name="instagram" label="Instagram (Opcional)" />
            </div>
            <ControlledComboBox
                name="identity_territory_id"
                label="Território de Identidade (Opcional)"
                options={normalizedTerritories || []}
            />
            <ControlledImageUpload
                name="images"
                label="Imagens (Opcional)"
                multiple={true}
            />
        </>
    );
};

"use client";

import { Section } from "../Section";
import useSWR from "swr";
import { getSchools } from "@/core/service/SchoolService";
import { useState } from "react";
import { PersonStanding } from "lucide-react";
import {
    createResearcher,
    getResearchers,
} from "@/core/service/PesquisadorService";
import { BaseFormModal } from "../BaseFormAddModal";
import { InputField } from "../ui/FormInputField";
import { ControlledSelect } from "../ui/ControlledSelect";
import { ResearcherTypes } from "@/core/constants/researcherType";
import { RaceTypes } from "@/core/constants/race";
import { GenderTypes } from "@/core/constants/sex";
import {
    ResearcherSearchParams,
    ResearcherCreate,
    ResearcherCreateSchema,
} from "@/core/domain/Researcher";
interface ResearcherAdmProps {
    params: ResearcherSearchParams;
}
export const ResearcherAdm = ({ params }: ResearcherAdmProps) => {
    const { data: pesquisadores, mutate } = useSWR(
        ["researcher", params],
        ([, p]) => getResearchers(p)
    );

    const { data: escolas } = useSWR("escolas", () => getSchools());
    const [open, setOpen] = useState(false);
    const onSubmit = async (data: ResearcherCreate) => {
        console.log("Researcher", data);
        await createResearcher(data);
        mutate();
        setOpen(false);
    };
    if (!pesquisadores) return null;
    return (
        <>
            <Section
                title="Pesquisadores"
                items={pesquisadores}
                icon={<PersonStanding />}
                onAdd={() => setOpen(true)}
            />
            <BaseFormModal<typeof ResearcherCreateSchema, ResearcherCreate>
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
                title="Adicionar Pesquisador"
                schema={ResearcherCreateSchema}>
                <InputField name="name" label="Nome do Pesquisador" />
                <InputField
                    name="lattes_id"
                    label="Id do Lattes"
                    maxLength={16}
                />
                <div className="flex w-full gap-2">
                    <ControlledSelect
                        className="w-full"
                        name="type"
                        label="Tipo de Pesquisador"
                        options={Object.values(ResearcherTypes)}
                    />
                </div>
                <div className="flex w-full gap-2">
                    <ControlledSelect
                        className="w-full"
                        name="race"
                        label="Raça"
                        options={Object.values(RaceTypes)}
                    />
                    <ControlledSelect
                        className="w-full"
                        name="gender"
                        label="Gênero"
                        options={Object.values(GenderTypes)}
                    />
                </div>
            </BaseFormModal>
        </>
    );
};

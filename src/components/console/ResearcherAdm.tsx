"use client";

import { useState, useEffect } from "react";
import { EntityConsole } from "./generic/EntityConsole";
import { ResearcherForm } from "./forms/ResearcherForm";
import { ResearcherProjectsList } from "./ResearcherProjectsList";
import {
    getResearchers,
    createResearcher,
    updateResearcher,
    deleteResearcher,
} from "@/core/service/PesquisadorService";
import {
    Researcher,
    ResearcherCreate,
    ResearcherCreateSchema,
    ResearcherUpdate,
    ResearcherSearchParams,
    ResearcherUpdateSchema,
} from "@/core/domain/Researcher";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const ResearcherFiltersModal = ({
    currentParams,
    applyParams,
    closeFilters,
}: {
    currentParams: any;
    applyParams: (params: any) => void;
    closeFilters: () => void;
}) => {
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedGender, setSelectedGender] = useState<string>("");
    const [selectedRace, setSelectedRace] = useState<string>("");

    useEffect(() => {
        const rawType = currentParams.type;
        const initialType = Array.isArray(rawType)
            ? rawType[0]
            : (rawType as string) || "";
        setSelectedType(initialType);

        const rawGender = currentParams.gender;
        const initialGender = Array.isArray(rawGender)
            ? rawGender[0]
            : (rawGender as string) || "";
        setSelectedGender(initialGender);

        const rawRace = currentParams.race;
        const initialRace = Array.isArray(rawRace)
            ? rawRace[0]
            : (rawRace as string) || "";
        setSelectedRace(initialRace);
    }, [currentParams]);

    const handleApply = () => {
        const newParams = { ...currentParams };

        newParams.type = selectedType || undefined;
        newParams.gender = selectedGender || undefined;
        newParams.race = selectedRace || undefined;

        applyParams(newParams);
        closeFilters();
    };

    const handleClear = () => {
        setSelectedType("");
        setSelectedGender("");
        setSelectedRace("");

        const newParams = { ...currentParams };
        newParams.type = undefined;
        newParams.gender = undefined;
        newParams.race = undefined;

        applyParams(newParams);
        closeFilters();
    };

    return (
        <>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Tipo de Pesquisador</label>
                    <Select
                         value={selectedType || "all"}
                         onValueChange={(val) =>
                             setSelectedType(val === "all" ? "" : val)
                         }>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="Aluno">Aluno</SelectItem>
                            <SelectItem value="Professor">Professor</SelectItem>
                            <SelectItem value="Facilitador">Facilitador</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">Gênero</label>
                    <Select
                         value={selectedGender || "all"}
                         onValueChange={(val) =>
                             setSelectedGender(val === "all" ? "" : val)
                         }>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos os gêneros" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os gêneros</SelectItem>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Feminino">Feminino</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                            <SelectItem value="Não informado">Não informado</SelectItem>
                            <SelectItem value="Prefiro não informar">
                                Prefiro não informar
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">Raça / Cor</label>
                    <Select
                         value={selectedRace || "all"}
                         onValueChange={(val) =>
                             setSelectedRace(val === "all" ? "" : val)
                         }>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todas as raças/cores" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as raças/cores</SelectItem>
                            <SelectItem value="Branca">Branca</SelectItem>
                            <SelectItem value="Preta">Preta</SelectItem>
                            <SelectItem value="Parda">Parda</SelectItem>
                            <SelectItem value="Amarela">Amarela</SelectItem>
                            <SelectItem value="Indígena">Indígena</SelectItem>
                            <SelectItem value="Não informado">Não informado</SelectItem>
                            <SelectItem value="Prefiro não informar">
                                Prefiro não informar
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-between">
                <Button variant="outline" onClick={handleClear}>
                    Limpar Filtros
                </Button>
                <Button onClick={handleApply}>Aplicar</Button>
            </DialogFooter>
        </>
    );
};

interface ResearcherAdmProps {
    params: ResearcherSearchParams;
}

export const ResearcherAdm = ({ params }: ResearcherAdmProps) => {
    const config: AdminEntityConfig<
        Researcher,
        ResearcherCreate,
        ResearcherUpdate,
        typeof ResearcherCreateSchema,
        typeof ResearcherUpdateSchema
    > = {
        title: "Pesquisadores",
        entityName: "researchers",
        createSchema: ResearcherCreateSchema,
        updateSchema: ResearcherUpdateSchema,
        defaultValues: { projects_ids: [] },
        renderForm: (props) => <ResearcherForm {...props} />,
        renderFilters: (props) => <ResearcherFiltersModal {...props} />,
        childTabs: [
            {
                id: "projetos",
                label: "Projetos",
                entityName: "projetos",
                parentIdField: "researcher_id",
                renderList: (parentId) => (
                    <ResearcherProjectsList researcherId={parentId} />
                ),
            },
        ],
        fetchFn: getResearchers,
        createFn: createResearcher,
        updateFn: updateResearcher,
        deleteFn: deleteResearcher,
    };

    return <EntityConsole config={config} params={params} />;
};

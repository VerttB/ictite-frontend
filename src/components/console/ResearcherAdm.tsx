"use client";

import React from "react";
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
} from "@/core/domain/Researcher";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";

interface ResearcherAdmProps {
    params: ResearcherSearchParams;
}

export const ResearcherAdm = ({ params }: ResearcherAdmProps) => {
    const config: AdminEntityConfig<Researcher, ResearcherCreate, ResearcherUpdate, typeof ResearcherCreateSchema> = {
        title: "Pesquisadores",
        entityName: "researchers",
        schema: ResearcherCreateSchema,
        defaultValues: { projects_ids: [] },
        renderForm: (props) => <ResearcherForm {...props} />,
        childTabs: [
            {
                id: "projetos",
                label: "Projetos",
                entityName: "projetos",
                parentIdField: "researcher_id",
                renderList: (parentId) => <ResearcherProjectsList researcherId={parentId} />,
            },
        ],
        fetchFn: getResearchers,
        createFn: createResearcher,
        updateFn: updateResearcher,
        deleteFn: deleteResearcher,
    };

    return <EntityConsole config={config} params={params} />;
};

"use client";

import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { Project } from "@/core/interface/Project";
import { BookOpen, PanelsTopLeft } from "lucide-react";
import CardProjeto from "../projeto/ProjetoCard";
import { useState } from "react";
import CardPesquisador from "../pesquisador/PesquisadorCard";

interface ClubeProjetoPesquisadorProps {
    projects: Project[];
    pesquisador: Researcher[];
}

export default function ClubeProjetoPesquisador({
    projects,
    pesquisador,
}: ClubeProjetoPesquisadorProps) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <PanelsTopLeft />
                <h1 className="text-2xl font-semibold">Projetos:</h1>
            </div>
            <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-4">
                {projects.map((project) => (
                    <CardProjeto key={project.id} project={project} />
                ))}
            </div>

            <div className="flex items-center gap-2">
                <BookOpen />
                <h1 className="text-2xl font-semibold">Pesquisadores:</h1>
            </div>
            <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {pesquisador.map((pesquisador) => (
                    <CardPesquisador
                        key={pesquisador.id}
                        researcher={pesquisador}
                    />
                ))}
            </div>
        </div>
    );
}

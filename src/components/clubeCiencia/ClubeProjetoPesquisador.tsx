"use client"

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

export default function ClubeProjetoPesquisador({ projects, pesquisador }: ClubeProjetoPesquisadorProps) {

    return (
        <div className="flex flex-col gap-5">
            <div className="flex gap-2 items-center">
                <PanelsTopLeft />
                <h1 className="text-2xl font-semibold">Projetos:</h1>
            </div>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                {projects.map((project) => (
                        <CardProjeto key={project.id} project={project} />
                ))}
            </div>

            <div className="flex gap-2 items-center">
                <BookOpen />
                <h1 className="text-2xl font-semibold">Pesquisadores:</h1>
            </div>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
                {pesquisador.map((pesquisador) => (
                        <CardPesquisador key={pesquisador.id} researcher={pesquisador} />
                ))}
            </div>
        </div>
    )
}
"use client";

import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { Project } from "@/core/interface/Project";
import { BookOpen, PanelsTopLeft } from "lucide-react";
import CardProjeto from "../projeto/ProjetoCard";
import CardPesquisador from "../pesquisador/PesquisadorCard";
import { ResearcherByType } from "@/core/interface/Pesquisador/ResearcherByType";

interface ClubeProjetoPesquisadorProps {
    projects: Project[];
    pesquisador: ResearcherByType;
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

            <div className="flex flex-col gap-2">
                {/* PROFESSORES */}
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h2 className="text-xl font-semibold">Professor</h2>
                    {pesquisador.Professor.length > 0 ? (
                        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                            {pesquisador.Professor.map((professor) => (
                                <CardPesquisador
                                    key={professor.id}
                                    researcher={professor}
                                />
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p>Não há professores cadastrados no clube</p>
                        </div>
                    )}
                </div>

                {/* ALUNOS */}
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h2 className="text-xl font-semibold">Aluno</h2>
                    {pesquisador.Aluno.length > 0 ? (
                        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                            {pesquisador.Aluno.map((aluno) => (
                                <CardPesquisador
                                    key={aluno.id}
                                    researcher={aluno}
                                />
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p>Não há alunos cadastrados no clube</p>
                        </div>
                    )}
                </div>

                {/* COORDENADORES */}
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h2 className="text-xl font-semibold">Coordenador</h2>
                    { pesquisador.Coordenador.length > 0 ? (
                        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                            {pesquisador.Coordenador.map((coordenador) => (
                                <CardPesquisador
                                    key={coordenador.id}
                                    researcher={coordenador}
                                />
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p>Não há coordenadores cadastrados no clube</p>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

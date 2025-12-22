"use client";

import { Project } from "@/core/domain/Project";
import {
    BookA,
    BookOpen,
    BookOpenText,
    HeartHandshake,
    PanelsTopLeft,
} from "lucide-react";
import CardProjeto from "../projeto/ProjetoCard";
import CardPesquisador from "../pesquisador/PesquisadorCard";
import { ResearcherByType } from "@/core/domain/Researcher";

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
            <div>
                {Array.isArray(projects) && projects.length > 0 ? (
                    <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-4">
                        {projects.map((project) => (
                            <CardProjeto key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="border-muted-foreground/40 bg-muted/10 text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-md border border-dashed py-10">
                        <PanelsTopLeft className="h-8 w-8 opacity-50" />
                        <p className="text-center text-sm font-medium">
                            Nenhum projeto cadastrado neste clube.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <BookOpen />
                <h1 className="text-2xl font-semibold">Pesquisadores:</h1>
            </div>

            <div className="flex flex-col gap-2">
                {/* PROFESSORES */}
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h2 className="text-xl font-semibold">Professor</h2>
                    {Array.isArray(pesquisador.professor) &&
                    pesquisador.professor.length > 0 ? (
                        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                            {pesquisador.professor.map((professor) => (
                                <CardPesquisador
                                    key={professor.id}
                                    researcher={professor}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="border-muted-foreground/40 bg-muted/10 text-muted-foreground flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed py-10">
                            <BookOpenText className="h-8 w-8 opacity-50" />
                            <p className="text-center text-sm font-medium">
                                Nenhum Professor cadastrado neste clube.
                            </p>
                        </div>
                    )}
                </div>

                {/* ALUNOS */}
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h2 className="text-xl font-semibold">Aluno</h2>
                    {Array.isArray(pesquisador.aluno) &&
                    pesquisador.aluno.length > 0 ? (
                        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                            {pesquisador.aluno.map((aluno) => (
                                <CardPesquisador
                                    key={aluno.id}
                                    researcher={aluno}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="border-muted-foreground/40 bg-muted/10 text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-md border border-dashed py-10">
                            <BookA className="h-8 w-8 opacity-50" />
                            <p className="text-center text-sm font-medium">
                                Nenhum Alunos cadastrado neste clube.
                            </p>
                        </div>
                    )}
                </div>

                {/* COORDENADORES */}
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h2 className="text-xl font-semibold">Coordenador</h2>
                    {Array.isArray(pesquisador.coordenador) &&
                    pesquisador.coordenador.length > 0 ? (
                        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                            {pesquisador.coordenador.map((coordenador) => (
                                <CardPesquisador
                                    key={coordenador.id}
                                    researcher={coordenador}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="border-muted-foreground/40 bg-muted/10 text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-md border border-dashed py-10">
                            <HeartHandshake className="h-8 w-8 opacity-50" />
                            <p className="text-center text-sm font-medium">
                                Nenhum Coordenador cadastrado neste clube.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

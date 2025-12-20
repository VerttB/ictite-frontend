"use client";
import CardPesquisador from "./PesquisadorCard";
import { capitalize } from "@/core/utils/capitalize";
import useSWR from "swr";
import { getProjectResearchers } from "@/core/service/ProjetoService";
import { Spinner } from "../LoadingSpin";
import { BookA, BookOpen, BookOpenText, HeartHandshake } from "lucide-react";
import { ResearcherByType } from "@/core/interface/Pesquisador/ResearcherByType";
export const PesquisadoresLista = ({ projectId }: { projectId: string }) => {
    const { data: pesquisador, isLoading } = useSWR<ResearcherByType>(
        `project-${projectId}`,
        () => getProjectResearchers(projectId)
    );
    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <BookOpen />
                        <h1 className="text-2xl font-semibold">Pesquisadores:</h1>
                    </div>

                    <div className="flex flex-col gap-2">
                        
                        {/* PROFESSORES */}
                        <div className="flex flex-col gap-2 border-b pb-4">
                            <h2 className="text-xl font-semibold">Professor</h2>
                            {pesquisador?.Professor?.length  ? (
                                <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                    {pesquisador?.Professor.map((professor) => (
                                        <CardPesquisador
                                            key={professor.id}
                                            researcher={professor}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/40 bg-muted/10 py-10 text-muted-foreground">
                                    <BookOpenText className="h-8 w-8 opacity-50" />
                                    <p className="text-center text-sm font-medium">
                                        Nenhum Professor cadastrado neste proejeto.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ALUNOS */}
                        <div className="flex flex-col gap-2 border-b pb-4">
                            <h2 className="text-xl font-semibold">Aluno</h2>
                            {pesquisador?.Aluno?.length  ? (
                                <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                    {pesquisador?.Aluno.map((aluno) => (
                                        <CardPesquisador
                                            key={aluno.id}
                                            researcher={aluno}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/40 bg-muted/10 py-10 text-muted-foreground">
                                    <BookA className="h-8 w-8 opacity-50" />
                                    <p className="text-center text-sm font-medium">
                                        Nenhum Alunos cadastrado neste projeto.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* COORDENADORES */}
                        <div className="flex flex-col gap-2 border-b pb-4">
                            <h2 className="text-xl font-semibold">Coordenador</h2>
                            { pesquisador?.Coordenador?.length  ? (
                                <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                    {pesquisador?.Coordenador.map((coordenador) => (
                                        <CardPesquisador
                                            key={coordenador.id}
                                            researcher={coordenador}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/40 bg-muted/10 py-10 text-muted-foreground">
                                    <HeartHandshake className="h-8 w-8 opacity-50" />
                                    <p className="text-center text-sm font-medium">
                                        Nenhum Coordenador cadastrado neste projeto.
                                    </p>
                                </div>
                            )}
                            
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

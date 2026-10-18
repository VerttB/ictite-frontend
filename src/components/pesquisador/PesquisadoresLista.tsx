"use client";
import CardPesquisador from "./PesquisadorCard";
import useSWR from "swr";
import { getProjectResearchers } from "@/core/service/ProjetoService";
import { Spinner } from "../LoadingSpin";
import { BookA, BookOpen, BookOpenText, HeartHandshake, RotateCcw } from "lucide-react";
import { ResearcherByType } from "@/core/domain/Researcher";
import CardNaoEncontrado from "../card/CardNaoEncontrado";
export const PesquisadoresLista = ({ projectId }: { projectId: string }) => {
    const { data: pesquisador, error, isLoading, mutate } = useSWR<ResearcherByType>(
        `project-${projectId}`,
        () => getProjectResearchers(projectId)
    );
    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : error ? (
                <div role="alert" className="flex flex-col items-start gap-3 text-font-secondary">
                    <p>Não foi possível carregar os pesquisadores deste projeto.</p>
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded border px-3 py-2 text-font-primary"
                        onClick={() => void mutate()}>
                        <RotateCcw size={16} />
                        Tentar novamente
                    </button>
                </div>
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
                            {pesquisador?.professor?.length ? (
                                <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                    {pesquisador?.professor.map((professor) => (
                                        <CardPesquisador
                                            key={professor.id}
                                            researcher={professor}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <CardNaoEncontrado
                                        icon={BookOpenText}
                                        text="Nenhum professor cadastrado neste projeto."
                                    />
                                </div>
                            )}
                        </div>

                        {/* ALUNOS */}
                        <div className="flex flex-col gap-2 border-b pb-4">
                            <h2 className="text-xl font-semibold">Aluno</h2>
                            {pesquisador?.aluno?.length ? (
                                <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                    {pesquisador?.aluno.map((aluno) => (
                                        <CardPesquisador
                                            key={aluno.id}
                                            researcher={aluno}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <CardNaoEncontrado
                                        icon={BookA}
                                        text="Nenhum aluno cadastrado neste projeto."
                                    />
                                </div>
                            )}
                        </div>

                        {/* FACILITADORES */}
                        <div className="flex flex-col gap-2 border-b pb-4">
                            <h2 className="text-xl font-semibold">Facilitador</h2>
                            {pesquisador?.facilitador?.length ? (
                                <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                    {pesquisador?.facilitador.map((facilitador) => (
                                        <CardPesquisador
                                            key={facilitador.id}
                                            researcher={facilitador}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <CardNaoEncontrado
                                        icon={HeartHandshake}
                                        text="Nenhum facilitador cadastrado neste projeto."
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

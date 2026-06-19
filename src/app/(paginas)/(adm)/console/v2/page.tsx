"use client";

import CardEntidade from "@/components/card/CardEntidade";
import MenuSuperiorPagina from "@/components/MenuSuperiorPagina";
import { Bolt, Book, BookOpen, ClipboardList, Handshake, LucideIcon, Milestone, Newspaper, Printer, School, SquareChartGantt, Video } from "lucide-react";
import { Route } from "next";
import Link from "next/link";

interface Entidade {
    nome: string;
    icon: LucideIcon;
    path: Route;
}

export default function ConsoleV2() {

    const entidades : Entidade[] = [
        { nome: "Escolas", icon: School, path: "/console/v2/escolas" },
        { nome: "Clubes", icon: Handshake, path: "/console/v2/clubes" },
        { nome: "Projetos", icon: SquareChartGantt, path: "/console/v2/projetos" },
        { nome: "Pesquisadores", icon: Book, path: "/console/v2/pesquisadores" },
        { nome: "Equipamentos", icon: Printer, path: "/console/v2/equipamentos" },
        { nome: "Materiais", icon: BookOpen, path: "/console/v2/materiais" },
        { nome: "Revistas", icon: Newspaper, path: "/console/v2/revistas" },
        { nome: "Videos", icon: Video, path: "/console/v2/videos" },
    ];

    return(
        <div className="flex w-full flex-col gap-8 py-4 sm:px-8">
            <MenuSuperiorPagina title="Console" />
            
            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className="bg-primary mx-4 mt-4 flex flex-col gap-3 rounded-md border border-blue-100 p-4 text-white shadow-sm">
                <div className="flex flex-col gap-0">
                    <h2 className="flex items-center gap-1 text-xl font-semibold">
                        <Bolt size={18} />
                        Console
                    </h2>
                </div>
                <p className="text-sm sm:text-base">
                    Painel administrativo do ICTITE, onde poderá ser cadastrado e gerenciado os dados do ICTITE.
                </p>
            </div>

            {/* |=======| ENTIDADES DA PÁGINA |=======| */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* |=======| INSTRUÇÕES PARA SABER MEXER NO CONSOLE |=======| */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-5 items-center">
                        <ClipboardList />
                        <h2 className="font-semibold text-xl">Instruções</h2>
                    </div>
                    <div>
                        <ul className="list-decimal list-outside pl-5 space-y-2">
                            <li>Selecione a <strong>entidade</strong> desejada no campo de opções.</li>
                            <li>Precione o botão de <strong>Adicionar</strong>, sendo exemplificado com o sinal de '+'.</li>
                            <li>Preencha os campos obrigatórios e clique em <strong>Criar</strong>.</li>
                            <li>Caso tenha entidade filhos, cadastra-os e clique em <strong>Criar</strong>.</li>
                            <li>Ao final, voltará para a página de <strong>Console da entidade salva</strong> e será listada.</li>
                            <li>Poderá ser visualizado todas <strong>as entidade salva</strong>.</li>
                            <li>Fique avontade para fazer buscas e filtros em busca de uma entidade específica, caso queira alterar ou excluir.</li>
                        </ul>
                    </div>
                </div>
                {/* |=======| LISTA DOS CARDS DE EXEMPLO DAS ENTIDADES DE CADASTRO |=======| */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-5 items-center">
                        <Milestone />
                        <h2 className="font-semibold text-xl">Entidades</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {entidades.map((entidade) => (
                            <Link href={entidade.path} key={entidade.nome}>
                                <CardEntidade entidade={entidade}/>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
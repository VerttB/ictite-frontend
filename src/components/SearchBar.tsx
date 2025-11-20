"use client";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getSchools } from "@/core/service/SchoolService";
import { getResearchers } from "@/core/service/PesquisadorService";
import { SugestionList } from "./SugestionList";
import { SugestionBase } from "@/core/interface/SugestionBase";
import { getProjects } from "@/core/service/ProjetoService";
import { getClubesCiencia } from "@/core/service/ClubeCienciaService";

interface SearchBarProps {
    onSugestoesChange?: (sugestoes: Record<string, SugestionBase[]>) => void;
}

export const SearchBar = ({ onSugestoesChange }: SearchBarProps) => {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [sugestions, setSugestions] = useState<
        Record<string, SugestionBase[]>
    >({ pesquisadores: [], escolas: [], projetos: [], clubes: [] });

    const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    //     function arrayFetcher(...urlArr:string[]) {
    //     const f = (u:string) => fetch(u).then((r) => r.json());
    //     return Promise.all(urlArr.map(f));

    // }

    const getData = async (val: string) => {
        const [schools, researchers, projects, clubes] = await Promise.all([
            getSchools(val),
            getResearchers(val),
            getProjects(val),
            getClubesCiencia(val),
        ]);

        setSugestions({
            escolas: schools || [],
            pesquisadores: researchers || [],
            projetos: projects || [],
            clubes: clubes || [],
        });

        if (onSugestoesChange) {
            onSugestoesChange(sugestions);
        }
    };

    useEffect(() => {
        if (value.length >= 2) {
            const debounce = setTimeout(() => {
                getData(value);
            }, 500);
            return () => clearTimeout(debounce);
        } else {
            setSugestions({
                escolas: [],
                pesquisadores: [],
                projetos: [],
                clubes: [],
            });

            if (onSugestoesChange) {
                onSugestoesChange(sugestions);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // |=======| FUNÇÃO QUE ATUALIZA OS VALORES QUANDO CLICA NO BOTÃO |=======|
    const handleSearchClick = (id: string) => {
        getData(value);

        //  ROLAGEM SUAVE ATÉ A BUSCA
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    // |=======| FUNÇÃO PARA CAPTURAR O ENTER |=======|
    const handleSearchEnter = (
        event: React.KeyboardEvent<HTMLInputElement>,
        id = "escolas"
    ) => {
        if (event.key === "Enter") {
            getData(value);

            //  ROLAGEM SUAVE ATÉ A BUSCA
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <div className="flex flex-col gap-0">
            <div className="relative mt-5 w-full flex-grow">
                <Input
                    ref={inputRef}
                    onChange={handleValueChange}
                    onKeyDown={handleSearchEnter}
                    value={value}
                    type={"search"}
                    placeholder="Busca por escola, clube, pesquisador ou projetos"
                    className="w-full rounded-lg border-2 px-4 py-2 pr-10"
                />
                <Button
                    onClick={() => handleSearchClick("escolas")}
                    variant={"ghost"}
                    size={"icon"}
                    className="bg-primary absolute top-1/2 right-1 mr-0.25 h-8 w-8 -translate-y-1/2 transform cursor-pointer text-white transition-colors hover:bg-lime-600 hover:text-white">
                    <Search />
                </Button>
            </div>
            {value.length >= 2 && (
                <div className="bg-foreground flex max-h-64 overflow-auto rounded-2xl px-8 py-4 shadow-2xl">
                    <SugestionList data={sugestions} />
                </div>
            )}
        </div>
    );
};

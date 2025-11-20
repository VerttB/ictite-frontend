"use client";
import { useEffect, useState } from "react";
import { SugestionBase } from "@/core/interface/SugestionBase";
import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import CardPesquisador from "./PesquisadorCard";
import { getResearcherById } from "@/core/service/PesquisadorService";
import { Spinner } from "../LoadingSpin";

interface Props {
    suggestion: SugestionBase;
}

export default function PesquisadorLoader({ suggestion }: Props) {
    const [researcher, setResearcher] = useState<Researcher | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const data = await getResearcherById(suggestion.id, true);
                if (!mounted) return;
                setResearcher(data);
            } catch (e) {
                console.error("Erro ao carregar researcher", e);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [suggestion.id]);

    if (loading)
        return (
            <div className="text-primary flex h-[250px] w-[200px] items-center justify-center rounded border">
                <Spinner />
            </div>
        );
    if (!researcher) return <div>Nenhum pesquisador encontrado ou buscado</div>;
    return <CardPesquisador researcher={researcher} />;
}

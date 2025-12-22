"use client";

import { ScienceClub } from "@/core/domain/Club";
import { SugestionBase } from "@/core/interface/SugestionBase";
import { getClubeCienciaById } from "@/core/service/ClubeCienciaService";
import { useEffect, useState } from "react";
import { Spinner } from "../LoadingSpin";
import ClubeCienciaCard from "./ClubeCienciaCard";

interface ClubeCienciaLoaderProps {
    sugestion: SugestionBase;
}

export default function ClubeCienciaLoader({
    sugestion,
}: ClubeCienciaLoaderProps) {
    const [clube, setClube] = useState<ScienceClub | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const loadClube = async () => {
            setLoading(true);
            try {
                const data = await getClubeCienciaById(sugestion.id);
                if (!mounted) return;
                setClube(data);
            } catch (e) {
                console.error("Erro ao carregar Clube", e);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadClube();

        return () => {
            mounted = false;
        };
    }, [sugestion.id]);

    if (loading)
        return (
            <div className="text-primary flex h-[250px] w-[200px] items-center justify-center rounded border">
                <Spinner />
            </div>
        );

    if (!clube) return <div>Nenhum clube encontrado ou buscado</div>;

    return <ClubeCienciaCard clubeCiencia={clube} />;
}

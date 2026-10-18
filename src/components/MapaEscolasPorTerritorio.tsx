"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/LoadingSpin";

const MapaEscolasLeaflet = dynamic(() => import("./MapaEscolasLeaflet"), {
    ssr: false,
    loading: () => (
        <div className="flex h-80 items-center justify-center gap-3 text-font-secondary">
            <Spinner />Carregando mapa...
        </div>
    ),
});

export default function MapaEscolasPorTerritorio() {
    return <MapaEscolasLeaflet />;
}

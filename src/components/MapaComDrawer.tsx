"use client"
import { useState } from "react";
import Escola from "./escola/Escola";
import MapaRender from "./Mapa";
import { useFetch } from "@/hooks/useFetch";
import { SchoolData } from "@/core/interface/School";



export default function MapaComDrawer () {


    // Estado para controlar abertura do Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Dados da escola selecionada (ou null)
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");

    // Função que o mapa vai chamar ao clicar num ponto
    async function handlePointClick(props: any) {
        setSelectedSchoolId(props.id);
        setDrawerOpen(true);
    }

    return (
        <>
        <MapaRender onUnclusteredPointClick={handlePointClick} />
        <Escola
            schoolId={selectedSchoolId}
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            
        />
        </>
    );
}
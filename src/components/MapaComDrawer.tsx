"use client"
import { useState } from "react";
import Escola from "./escola/Escola";
import MapaRender from "./Mapa";

interface EscolaData{
    nome: string,
    cidade: string,
    estado:string,
    descricao:string,
    imagemUrl:string,
}

export default function MapaComDrawer () {


    // Estado para controlar abertura do Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Dados da escola selecionada (ou null)
    const [selectedSchool, setSelectedSchool] = useState<EscolaData | null>(null);

    // Função que o mapa vai chamar ao clicar num ponto
    async function handlePointClick(props: any) {
        
        const escola: EscolaData = {
        nome: props.nome || '—',
        cidade: props.cidade,
        estado: props.estado,
        descricao: props.descricao || '',
        imagemUrl: props.imagemUrl || 'https://picsum.photos/200/200',
        // … outros campos
        };
        console.log(props)
        setSelectedSchool(escola);
        setDrawerOpen(true);
    }

    return (
        <>
        <MapaRender onUnclusteredPointClick={handlePointClick} />
        <Escola
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            
        />
        </>
    );
}
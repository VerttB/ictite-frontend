import { useState } from "react";
import Escola from "./escola/Escola";
import MapaRender from "./Mapa";

export default function MapaComDrawer () {
    // Estado para controlar abertura do Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Dados da escola selecionada (ou null)
    const [selectedSchool, setSelectedSchool] = useState<EscolaData | null>(null);

    // Função que o mapa vai chamar ao clicar num ponto
    function handlePointClick(props: any) {
        // Extrai as propriedades que quiser
        const escola: EscolaData = {
        nome: props.nome || '—',
        cidade: props.cidade,
        estado: props.estado,
        descricao: props.descricao || '',
        imagemUrl: props.imagemUrl || 'https://picsum.photos/200/200',
        // … outros campos
        };
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
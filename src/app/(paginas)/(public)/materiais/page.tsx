"use client";

import React, { useMemo, useState } from "react";
import CardMateriais from "@/components/card/CardMateriais";
import { Button } from "@/components/ui/button";
import { BookText, ChevronLeft } from "lucide-react";
import CardCategoriaMateriais from "@/components/card/CardCategoriaMateriais";

export default function Materiais() {

    const [selectedType, setSelectedType] = useState<string | null>(null);
    
    const materiaisMock = [
        {
            id: "1",
            name: "Robótica Educacional",
            link: "https://minimakerlab.com.br/?page_id=481",
            description:
            "Material introdutório sobre robótica e sua aplicação em laboratórios makers. Inclui atividades práticas e vídeos explicativos.",
            type: "laboratórios makers",
            images: [
                "https://minimakerlab.com.br/wp-content/uploads/2019/10/robo-200x200.png",
            ],
        },
        {
            id: "2",
            name: "Display Box Maker",
            link: "https://minimakerlab.com.br/?page_id=82",
            description:
            "Guia de montagem e uso de display box em ambientes makers. Foco em eletrônica e prototipagem.",
            type: "laboratórios makers",
            images: [
                "https://minimakerlab.com.br/wp-content/uploads/2018/04/display_box.png",
            ],
        },
        {
            id: "3",
            name: "Oficina de Crafting",
            link: "https://minimakerlab.com.br/?page_id=86",
            description:
            "Atividades práticas com materiais recicláveis e sustentáveis voltadas à criatividade e design.",
            type: "laboratórios makers",
            images: [
                "https://minimakerlab.com.br/wp-content/uploads/2018/04/craft.png",
            ],
        },
        {
            id: "4",
            name: "Code Table Display",
            link: "https://minimakerlab.com.br/?page_id=92",
            description:
            "Exemplo de projeto de mesa interativa para ensino de lógica de programação.",
            type: "laboratórios makers",
            images: [
                "https://minimakerlab.com.br/wp-content/uploads/2018/04/display_codetable-1.png",
            ],
        },
        {
            id: "5",
            name: "Fotografia e Prototipagem",
            link: "https://minimakerlab.com.br/?page_id=368",
            description:
            "Uso de fotografia para documentar experimentos e protótipos. Inclui orientações de luz e composição.",
            type: "laboratórios makers",
            images: ["https://minimakerlab.com.br/wp-content/uploads/2018/12/foto2-2.jpg"],
        },
        // ---- exemplos extras de outros tipos ----
        {
            id: "6",
            name: "Introdução à Programação Criativa",
            link: "http://localhost:3000/videos/",
            description:
            "Vídeo introdutório sobre pensamento computacional e lógica aplicada à arte e design digital.",
            type: "Vídeo",
            images: ["https://picsum.photos/id/1015/400/300"],
        },
        {
            id: "7",
            name: "Guia de Energias Renováveis",
            link: "https://example.com/energias-renovaveis",
            description:
            "Guia prático sobre uso de energia solar e eólica em escolas, com kits experimentais.",
            type: "Apostila",
            images: ["https://picsum.photos/id/1022/400/300"],
        },
        {
            id: "8",
            name: "Sustentabilidade e Inovação",
            link: "https://example.com/sustentabilidade",
            description:
            "Artigo sobre o impacto da sustentabilidade na inovação tecnológica e educacional.",
            type: "Artigo",
            images: ["https://picsum.photos/id/1033/400/300"],
        },
        {
            id: "9",
            name: "Oficina de IoT para Iniciantes",
            link: "https://example.com/iot-iniciantes",
            description:
            "Apostila com exercícios práticos para introdução à Internet das Coisas usando Arduino.",
            type: "Apostila",
            images: ["https://picsum.photos/id/1045/400/300"],
        },
        {
            id: "10",
            name: "Experimentos de Física com Materiais Simples",
            link: "https://example.com/fisica-experimentos",
            description:
            "Coletânea de experimentos simples para aulas de física, utilizando materiais recicláveis.",
            type: "Artigo",
            images: ["https://picsum.photos/id/1062/400/300"],
        },
    ];

    // lista de categorias únicas com contagem
    const categorias = useMemo(() => {
        const map = new Map<string, number>();
        materiaisMock.forEach((m) => map.set(m.type, (map.get(m.type) || 0) + 1));
        return Array.from(map.entries()).map(([type, count]) => ({ name: type, type, count }));
    }, [materiaisMock]);

    // materiais filtrados (ou todos)
    const materiaisFiltrados = selectedType
        ? materiaisMock.filter((m) => m.type === selectedType)
        : materiaisMock;

    const handleFilter = (type: string) => {
        setSelectedType((prev) => (prev === type ? null : type));
    };

    return (
        <div className="flex w-full flex-col gap-8 py-4 sm:px-8">
            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <div className="flex flex-row items-center gap-5">
                <Button
                    size={"icon"}
                    variant={"outline"}
                    className="cursor-pointer">
                    <ChevronLeft />
                </Button>
                <p className="text-2xl font-semibold">Materiais Didáticos</p>
            </div>

            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className="bg-primary mx-4 mt-4 flex flex-col gap-3 rounded-md border border-blue-100 p-4 text-white shadow-sm">
                <div className="flex flex-col gap-0">
                    <h2 className="flex items-center gap-1 text-xl font-semibold">
                        <BookText size={18} />
                        Materias Educativos e Intuitivos
                    </h2>
                </div>
                <p className="text-sm sm:text-base">
                    Explore recursos educativos desenvolvidos para transformar o
                    ensino de ciências e tecnologia na Bahia. Oferecemos planos
                    de aula, kits experimentais e guias práticos sobre robótica,
                    energias renováveis e inovação, todos alinhados à realidade
                    local e de acesso gratuito. Ideal para professores e
                    estudantes, nossos materiais incentivam aprendizagem mão na
                    massa e abordagem investigativa.
                </p>
            </div>

            {/* |=======| CATEGORIAS DE MATERIAIS |=======| */}
            <div className="flex flex-col gap-2">
                <div className="text-2xl font-semibold">
                    <h2>Categorias</h2>
                </div>
                <div className="flex flex-wrap gap-2 items-center justify-center">
                    {categorias.map((categoria, i) => (
                        <CardCategoriaMateriais key={i} name={categoria.name} type={categoria.type} count={categoria.count} onFilter={handleFilter} active={selectedType === categoria.type} />
                    ))}
                </div>
            </div>

            {/* |=======| CATEGORIAS DE MATERIAIS |=======| */}
            <div className="flex flex-col gap-2">
                <div className="text-2xl font-semibold">
                    <h2>Materiais</h2>
                </div>
                <div className="grid grid-cols-1 justify-items-center gap-2 py-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {materiaisFiltrados.map((material) => (
                        <CardMateriais material={material} key={material.id} />
                    ))}
                </div>
            </div>
        </div>
    );
}

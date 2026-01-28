import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, PlayCircleIcon, PlaySquare } from "lucide-react";
import Link from "next/link";

export default function Videos() {
    const videosMock = [
        {
            id: "1",
            title: "Como criar sua conta Lattes",
            description: "Passo a passo completo para registro na plataforma Lattes...",
            url: "https://www.youtube.com/watch?v=SElLRiXLw7g",
            duration: "8:15",
            date: "15/10/2024",
            category: "Tutoriais",
        },
        {
            id: "2",
            title: "Como logar com o ORCCID",
            description:
                "Passo a passo completo para logar com ORCCID no portal ICTITE...",
            url: "https://www.youtube.com/watch?v=SElLRiXLw7g",
            duration: "8:15",
            date: "15/10/2024",
            category: "Tutoriais",
        },
        {
            id: "3",
            title: "Como Visualizar os projetos das escolas",
            description:
                "Passo a passo completo para visualizar os projetos científicos das escolas...",
            url: "https://www.youtube.com/watch?v=SElLRiXLw7g",
            duration: "8:15",
            date: "15/10/2024",
            category: "Tutoriais",
        },
    ];

    return (
        <div className="flex w-full flex-col gap-8 py-4 sm:px-8">
            {/* |=======| SUPERIOR DOS VÍDEOS |=======| */}
            <div className="flex flex-row items-center gap-4">
                <Link href={"/"}>
                    <Button size={"icon"} variant={"outline"}>
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Vídeos do ICTITE</h1>
            </div>

            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className="bg-primary mx-4 mt-4 flex flex-col gap-3 rounded-md border border-blue-100 p-4 text-white shadow-sm">
                <div className="flex flex-col gap-0">
                    <h2 className="flex items-center gap-1 text-xl font-semibold">
                        <PlaySquare size={18} />
                        Vídeos Tutorias e Explicativos
                    </h2>
                </div>
                <p className="text-sm sm:text-base">
                    Bem-vindo à nossa aba de vídeos! Nesta seção, você encontrará um
                    acervo dinâmico de conteúdos audiovisuais produzidos para apoiar sua
                    jornada no mundo da pesquisa e inovação educacional. Aqui você acessa
                    tutoriais, registros de eventos científicos, depoimentos e materiais
                </p>
            </div>

            {/* |=======| VÍDEOS |=======|*/}
            <div className="mx-2 flex flex-col gap-2 sm:mx-28">
                <Accordion type="multiple">
                    {videosMock.map((video) => (
                        <AccordionItem key={video.id} value={video.id}>
                            <AccordionTrigger className="rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex items-center gap-5">
                                    <PlayCircleIcon size={24} />
                                    <span className="text-left font-medium">
                                        {video.title}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-6 rounded-md bg-gray-50 p-4 xl:flex-row">
                                    {/* IFRAME DO VÍDEO */}
                                    <div className="xl:w-1/2">
                                        <iframe
                                            src={video.url}
                                            className="aspect-video w-full rounded-md shadow"
                                            allowFullScreen
                                        />
                                    </div>
                                    {/* INFORMAÇÃO DO VÍDEO */}
                                    <div className="xl:w-1/2">
                                        <div className="w-full">
                                            <h3 className="mb-2 text-xl font-semibold">
                                                {video.title}
                                            </h3>
                                            <p className="mb-3 text-gray-600">
                                                {video.description}
                                            </p>
                                            <p className="mb-3 text-gray-600">
                                                {video.category}
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {video.date} | {video.duration}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}

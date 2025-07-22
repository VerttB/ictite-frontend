import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, PlayCircleIcon, PlaySquare } from "lucide-react";
import Link from "next/link";

export default function Videos () {

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
            description: "Passo a passo completo para logar com ORCCID no portal ICTITE...",
            url: "https://www.youtube.com/watch?v=SElLRiXLw7g",
            duration: "8:15",
            date: "15/10/2024",
            category: "Tutoriais",
        },
        {
            id: "3",
            title: "Como Visualizar os projetos das escolas",
            description: "Passo a passo completo para visualizar os projetos científicos das escolas...",
            url: "https://www.youtube.com/watch?v=SElLRiXLw7g",
            duration: "8:15",
            date: "15/10/2024",
            category: "Tutoriais",
        },
        
    ]

    return(
        <div className="w-full p-8 flex flex-col gap-8">
            {/* |=======| SUPERIOR DOS VÍDEOS |=======| */}
            <div className="flex flex-row gap-4 items-center">
                <Link href={"/"}>
                    <Button size={"icon"} variant={"outline"}>
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Vídeos do ICTITE</h1>
            </div>

            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className=" flex flex-col gap-3 bg-verde text-white
                     p-4 mx-4 mt-4 rounded-md shadow-sm border border-blue-100
            ">
                <div className="flex flex-col gap-0">
                    <h2 className="text-xl font-semibold flex gap-1 items-center">
                        <PlaySquare size={18}/>
                        Vídeos Tutorias e Explicativos
                    </h2>
                    <p className="text-xs text-gray-300">Versão pré-beta do site ICTITE</p>
                </div>
                <p>Bem-vindo à nossa aba de vídeos! Nesta seção, você encontrará um acervo dinâmico de conteúdos 
                    audiovisuais produzidos para apoiar sua jornada no mundo da pesquisa e inovação educacional.
                    Aqui você acessa tutoriais, registros de eventos científicos, depoimentos e materiais</p>
            </div>

            {/* |=======| VÍDEOS |=======|*/}
            <div className="mx-28 flex flex-col gap-2">
                <Accordion type="multiple">
                    {videosMock.map((video) => (
                        <AccordionItem key={video.id} value={video.id}>
                            <AccordionTrigger className="hover:bg-gray-50 p-4 rounded-lg">
                                <div className="flex gap-5 items-center">
                                    <PlayCircleIcon  />
                                    <span className="text-left font-medium">{video.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div
                                    className="flex flex-col xl:flex-row gap-6 p-4 bg-gray-50 rounded-md">
                                    {/* IFRAME DO VÍDEO */}
                                    <div className="xl:w-1/2">
                                        <iframe
                                            src={video.url}
                                            className="w-full aspect-video rounded-md shadow"
                                            allowFullScreen
                                        />
                                    </div>
                                    {/* INFORMAÇÃO DO VÍDEO */}
                                    <div className="xl:w-1/2">
                                        <div className="w-full">
                                            <h3 className="font-semibold text-xl mb-2">{video.title}</h3>
                                            <p className="text-gray-600 mb-3">{video.description}</p>
                                            <p className="text-gray-600 mb-3">{video.category}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-1" />
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
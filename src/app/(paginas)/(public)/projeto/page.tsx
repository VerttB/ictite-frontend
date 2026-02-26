import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getAssetPrefix } from "@/core/utils/api";
import { Calendar, ChevronLeft, FileText } from "lucide-react";

export default function Projeto() {

    const documentos = [
        {
            id: "1",
            title: "Documento total do ICTITE",
            description: "Documento que descreve o projeto de ponta a ponta",
            type: "Institucional",
            data: "2023",
        },
        {
            id: "2",
            title: "Documento total do ICTITE",
            description: "Documento que descreve o projeto de ponta a ponta",
            type: "Institucional",
            data: "2023",
        },
        {
            id: "3",
            title: "Documento total do ICTITE",
            description: "Documento que descreve o projeto de ponta a ponta",
            type: "Institucional",
            data: "2023",
        }
    ]


    return (
        <div className="flex flex-col gap-8 py-4 sm:px-8">
            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <div className="flex flex-row items-center gap-5">
                <Button size={"icon"} variant={"outline"} className="cursor-pointer">
                    <ChevronLeft />
                </Button>
                <p className="text-2xl font-semibold">Documentos</p>
            </div>

            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className="bg-primary mx-4 mt-4 flex flex-col gap-3 rounded-md border border-blue-100 p-4 text-white shadow-sm">
                <div className="flex flex-col gap-0">
                    <h2 className="flex items-center gap-1 text-xl font-semibold">
                        <FileText size={18} />
                        Documentos do Projeto
                    </h2>
                </div>
                <p className="text-sm sm:text-base">
                    Acesse a base documental completa do Mais Ciência Na Escola Bahia. Aqui você encontra desde o estatuto de 
                    fundação até os guias práticos de conduta técnica e relatórios de impacto social.
                </p>
            </div>

            {/* |=======| DOCUMENTOS |=======| */}
            <div className="mx-2 flex flex-col gap-2 sm:mx-28">
                <Accordion type="multiple">
                    {documentos.map((documento) => (
                        <AccordionItem key={documento.id} title={documento.title} value={documento.id} className="my-2">
                            <AccordionTrigger className="border rounded-lg p-2">
                                <div className="flex gap-2 ">
                                    <div className="p-3 rounded-lg bg-primary text-white flex items-center">
                                        <FileText />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex gap-2 text-xs items-center">
                                            <div className="p-1 rounded-md bg-secondary text-white">
                                                {documento.type}
                                            </div>
                                            <div className="flex gap-0.5 items-center">
                                                <Calendar size={12}/>
                                                <p>{documento.data}</p>
                                            </div>
                                        </div>
                                        <h3 className="text-xl">{documento.title}</h3>
                                        <p className="text-sm font-normal">{documento.description}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <iframe
                                    className="h-[720px] w-full"
                                    src={`${getAssetPrefix()}/projeto.pdf`}></iframe>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            
        </div>
    );
}

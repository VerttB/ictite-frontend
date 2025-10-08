import CardRevista from "@/components/card/CardRevista";
import { Button } from "@/components/ui/button";
import { Revista } from "@/core/interface/Revista";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Revistas () {
    
    const revistasFecibaMock:Revista[] = [
        {
            id: 1,
            title: "Feciba revista 01", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/secti/sites/site-secti/files/migracao_2024/arquivos/File/IV_CCTI/revista__1.pdf"
        },
        {
            id: 2,
            title: "Site da Feciba", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba"
        },
        {
            id: 3,
            title: "Site da Feciba", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba"
        },
        {
            id: 4,
            title: "Site da Feciba", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba"
        },
        {
            id: 5,
            title: "Site da Feciba", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba"
        },
        {
            id: 6,
            title: "Site da Feciba", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba"
        },
        {
            id: 7,
            title: "Site da Feciba", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba"
        },
        {
            id: 8,
            title: "Site da Feciba", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba"
        },
    ]

    const revistasOutrasMock:Revista[] = [
        {
            id: 1,
            title: "Título da Revista", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/"
        },
        {
            id: 2,
            title: "Título da Revista", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/"
        },
        {
            id: 3,
            title: "Título da Revista", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/"
        },
        {
            id: 4,
            title: "Título da Revista", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/"
        },
        {
            id: 5,
            title: "Título da Revista", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/"
        },
        {
            id: 6,
            title: "Título da Revista", 
            description: "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/"
        },
    ]

    return(
        <div className="w-full  px-8 py-4 flex flex-col gap-8">
            {/* |=======| SUPERIOR DE REVISTAS |=======| */}
            <div className="flex flex-row gap-4 items-center">
                <Link href={"/"}>
                    <Button size={"icon"} variant={"outline"}>
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Revistas</h1>
            </div>
            {/* |=======| REVISTAS DA FECIBA |=======| */}
            <div className="relative">
                <div className="absolute inset-x-0 top-0 bg-cover bg-center bg-primary h-[230px] rounded-md"></div>
                <div className="relative">
                    <div className="flex flex-col gap-4 p-4">
                        <h2 className="text-xl font-semibold text-font-primary">FECIBA</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-center">
                            {revistasFecibaMock.map((revista) => (
                                <CardRevista key={revista.id} revista={revista} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* |=======| OUTRAS REVISTAS |=======| */}
            <div className="relative">
                <div className="absolute inset-x-0 top-0 bg-cover bg-center bg-secondary h-[230px] rounded-md"></div>
                <div className="relative">
                    <div className="flex flex-col gap-4 p-4">
                        <h2 className="text-xl font-semibold text-font-primary">OUTRAS REVISTAS</h2>
                        <div className="grid grid-cols-1  sm:grid-cols-2  xl:grid-cols-4 gap-4 justify-items-center">
                            {revistasOutrasMock.map((revista) => (
                                <CardRevista key={revista.id} revista={revista} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
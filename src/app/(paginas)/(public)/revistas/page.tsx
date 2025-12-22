import CardRevista from "@/components/card/CardRevista";
import { Button } from "@/components/ui/button";
import { Magazine } from "@/core/domain/Magazine";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Revistas() {
    const revistasFecibaMock: Magazine[] = [
        {
            id: "1",
            name: "Feciba revista 01",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/secti/sites/site-secti/files/migracao_2024/arquivos/File/IV_CCTI/revista__1.pdf",
            images: [],
        },
        {
            id: "2",
            name: "Site da Feciba",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba",
            images: [],
        },
        {
            id: "3",
            name: "Site da Feciba",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba",
            images: [],
        },
        {
            id: "4",
            name: "Site da Feciba",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba",
            images: [],
        },
        {
            id: "5",
            name: "Site da Feciba",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba",
            images: [],
        },
        {
            id: "6",
            name: "Site da Feciba",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba",
            images: [],
        },
        {
            id: "7",
            name: "Site da Feciba",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba",
            images: [],
        },
        {
            id: "8",
            name: "Site da Feciba",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "https://www.ba.gov.br/educacao/feira-de-ciencias-empreendedorismo-social-e-inovacao-da-bahia-feciba",
            images: [],
        },
    ];

    const revistasOutrasMock: Magazine[] = [
        {
            id: "1",
            name: "Título da Revista",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/",
            images: [],
        },
        {
            id: "2",
            name: "Título da Revista",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/",
            images: [],
        },
        {
            id: "3",
            name: "Título da Revista",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/",
            images: [],
        },
        {
            id: "4",
            name: "Título da Revista",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/",
            images: [],
        },
        {
            id: "5",
            name: "Título da Revista",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/",
            images: [],
        },
        {
            id: "6",
            name: "Título da Revista",
            description:
                "Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam",
            link: "/",
            images: [],
        },
    ];

    return (
        <div className="flex w-full flex-col gap-8 px-8 py-4">
            {/* |=======| SUPERIOR DE REVISTAS |=======| */}
            <div className="flex flex-row items-center gap-4">
                <Link href={"/"}>
                    <Button size={"icon"} variant={"outline"}>
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Revistas</h1>
            </div>
            {/* |=======| REVISTAS DA FECIBA |=======| */}
            <div className="relative">
                <div className="bg-primary absolute inset-x-0 top-0 h-[230px] rounded-md bg-cover bg-center"></div>
                <div className="relative">
                    <div className="flex flex-col gap-4 p-4">
                        <h2 className="text-font-primary text-xl font-semibold">
                            FECIBA
                        </h2>
                        <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {revistasFecibaMock.map((revista) => (
                                <CardRevista
                                    key={revista.id}
                                    revista={revista}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* |=======| OUTRAS REVISTAS |=======| */}
            <div className="relative">
                <div className="bg-secondary absolute inset-x-0 top-0 h-[230px] rounded-md bg-cover bg-center"></div>
                <div className="relative">
                    <div className="flex flex-col gap-4 p-4">
                        <h2 className="text-font-primary text-xl font-semibold">
                            OUTRAS REVISTAS
                        </h2>
                        <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {revistasOutrasMock.map((revista) => (
                                <CardRevista
                                    key={revista.id}
                                    revista={revista}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

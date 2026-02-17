import Image from "next/image";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import { Expand, GraduationCap, MapPin, ExternalLink, X } from "lucide-react";

import useSWR from "swr";
import { getResearcherById } from "@/core/service/PesquisadorService";
import { PesquisadorTabs } from "./PesquisadorTabs";
import { Spinner } from "../LoadingSpin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { useViewPort } from "@/hooks/useViewPort";
import { ScrollArea } from "../ScrollArea";
import { Route } from "next";

interface PesquisadorProps {
    isOpen: boolean;
    onClose: () => void;
    researcherId: string;
}

export default function Pesquisador({ isOpen, onClose, researcherId }: PesquisadorProps) {
    const router = useRouter();
    const { data: researcher, isLoading } = useSWR(
        researcherId ? `simcc-researcher-${researcherId}` : null,
        () => getResearcherById(researcherId)
    );
    const { isMobile } = useViewPort();

    if (!researcherId) return null;

    return (
        <Drawer
            open={isOpen}
            onOpenChange={onClose}
            direction={`${isMobile ? "bottom" : "right"}`}>
            <DrawerContent
                className={`flex flex-col p-0 ${
                    isMobile ? "h-[90vh] max-h-[90vh]" : "h-full w-[520px] max-w-full"
                }`}>
                <DrawerHeader className="shadow">
                    <div className="flex items-center justify-between border-b pb-2.5">
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="cursor-pointer">
                            <X />
                        </Button>
                        <Link href={`/pesquisadores/${researcherId}/` as Route}>
                            <Button size={"icon"} className="cursor-pointer">
                                <Expand />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex w-full flex-col items-center gap-2 p-2 shadow-xs sm:flex-row">
                        <div
                            className="relative h-72 w-full cursor-pointer sm:w-1/2"
                            onClick={() =>
                                router.push(`/pesquisadores/${researcherId}/` as Route)
                            }>
                            <Image
                                fill
                                src={
                                    researcher?.image
                                        ? `${researcher?.image}`
                                        : "https://picsum.photos/100/100"
                                }
                                alt="pesquisador"
                                className="border-border rounded-md border object-cover"
                            />
                        </div>
                        <div className="flex h-full w-full flex-col items-start justify-start gap-1 px-2">
                            <DrawerTitle className="text-font-primary text-2xl">
                                {researcher?.simcc && (
                                    <Link
                                        href={` https://simcc.uesc.br/researcher?lattes_id=${researcher.simcc.lattes_id}`}
                                        target="_blank"
                                        className="flex cursor-pointer"
                                        title="Ver no SIMCC">
                                        <h1 className="text-3xl">{researcher.name}</h1>
                                        <ExternalLink
                                            className="mb-2 ml-1 inline"
                                            size={20}
                                        />
                                    </Link>
                                )}
                            </DrawerTitle>
                            <div className="flex w-full gap-4">
                                {researcher?.simcc ? (
                                    <>
                                        <span className="text-font-primary/80 flex items-center gap-1 text-lg">
                                            <MapPin size={15} />
                                            <p>
                                                {researcher?.simcc.city ??
                                                    "Cidade não disponível"}
                                            </p>
                                        </span>
                                        <span className="text-font-primary/80 flex items-center gap-1 text-lg">
                                            <GraduationCap size={15} />
                                            <p>
                                                {researcher?.simcc.graduation ??
                                                    "Graduação não disponível"}
                                            </p>
                                        </span>
                                    </>
                                ) : (
                                    <p>Nenhuma informação disponível</p>
                                )}
                            </div>
                            <ScrollArea>
                                <DrawerDescription className={`py-2 pr-2 text-sm`}>
                                    {researcher?.simcc?.abstract ??
                                        "Descrição não disponível."}
                                </DrawerDescription>
                            </ScrollArea>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-2">
                    {isLoading ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2">
                            <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2" />
                            <Spinner size="medium">Carregando...</Spinner>
                        </div>
                    ) : researcher ? (
                        <div className="min-h-0 flex-1">
                            <PesquisadorTabs researcher={researcher} />
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">
                            Nenhum dado disponível para este pesquisador.
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

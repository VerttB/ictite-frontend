import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import {
  Expand,
  GraduationCap,
  MapPin,
  ExternalLink,
  School,

  X,
} from "lucide-react";

import useSWR from "swr";
import { getResearcherById } from "@/core/service/PesquisadorService";
import { PesquisadorTabs } from "./PesquisadorTabs";
import { Spinner } from "../LoadingSpin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { useViewPort } from "@/hooks/useViewPort";
import { ScrollArea } from "../ScrollArea";

interface PesquisadorProps {
  isOpen: boolean;
  onClose: () => void;
  researcherId: string;
}

export default function Pesquisador({
  isOpen,
  onClose,
  researcherId,
}: PesquisadorProps) {
  const router = useRouter();
  const { data: researcher, isLoading } = useSWR(
    researcherId ? `simcc-researcher-${researcherId}` : null,
    () => getResearcherById(researcherId, true)
  ); 
  const { isMobile } = useViewPort();

  if (!researcherId) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction={`${isMobile ? "bottom" : "right"}`}>
      <DrawerContent
        className={`flex flex-col p-0 ${
          isMobile ? "h-[90vh] max-h-[90vh]" : "h-full w-[520px] max-w-full"
        }`}
      >
        <DrawerHeader className="shadow">
          <div className="flex justify-between border-b items-center  pb-2.5 ">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
              className="cursor-pointer"
            >
              <X />
            </Button>
            <Link href={`/pesquisadores/${researcherId}/`}>
              <Button size={"icon"} className="cursor-pointer"><Expand /></Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row w-full  gap-2 p-2 shadow-xs items-center ">
            <div className="w-full sm:w-1/2 h-72  relative cursor-pointer"
                onClick={() => router.push(`/pesquisadores/${researcherId}/`)}>
              <Image
                  fill
                  src={researcher?.image ? `${researcher?.image}` : "https://picsum.photos/100/100"}
                  alt="pesquisador"
                  className="rounded-md border border-border object-cover"
                />
            </div>
            <div className="flex px-2 flex-col gap-1 w-full h-full justify-start items-start">
              <DrawerTitle className="text-2xl text-font-primary">
                {researcher?.name}
                {researcher?.simcc && 
                <Link href={` https://simcc.uesc.br/researcher?lattes_id=${researcher.simcc.lattes_id}`} 
                  target="_blank"
                  title="Ver no SIMCC"
                  className="cursor-pointer">
                  <ExternalLink
                    className="inline ml-1 mb-2" 
                    size={20} />
                </Link>}
              </DrawerTitle>
              <div className="flex gap-4 w-full">
                <span className="flex items-center gap-1 text-lg text-font-primary/80">
                  <MapPin size={15} />
                  <p>{researcher?.simcc.city ?? "Cidade não disponível"}</p>
                </span>
                <span className="flex items-center gap-1 text-lg text-font-primary/80">
                  <GraduationCap size={15} />
                  <p>{researcher?.simcc.graduation ?? "Graduação não disponível"}</p>
                </span>
                <span className="flex items-center gap-1 text-lg text-font-primary/80">
                  <School size={15} />
                  <p>{researcher?.school ?? "Instituição não disponível"}</p>
                </span>
                </div>
                    <ScrollArea>
                  <DrawerDescription className={`text-sm py-2 pr-2`}>
                      {researcher?.simcc?.abstract ?? "Descrição não disponível."}

                </DrawerDescription>
                    </ScrollArea>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 min-h-0 flex flex-col px-6 py-2 overflow-hidden ">
           {isLoading ?  (
            <div className="flex flex-col justify-center items-center h-full gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <Spinner size="medium">Carregando...</Spinner>
            </div>
          ) : researcher ? (
            <div className="min-h-0 flex-1">
              <PesquisadorTabs researcher={researcher} />
            </div>
          ) : (
            <div className="text-sm text-gray-500">Nenhum dado disponível para este pesquisador.</div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

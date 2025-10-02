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
  


  if (!researcherId) return null;
  if(!researcher) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent>
        <DrawerHeader className="shadow">
          <div className="flex justify-between border-b items-center  pb-2.5 ">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={onClose}
              className="cursor-pointer"
            >
              <X />
            </Button>
            <Link href={`/pesquisadores/${researcherId}`}>
              <Button size={"icon"} className="cursor-pointer"><Expand /></Button>
            </Link>
          </div>
          <div className="flex  flex-row w-full h-72 gap-2 p-2 shadow-xs items-center ">
            <div className="w-1/3 h-full  relative cursor-pointer"
                onClick={() => router.push(`/pesquisadores/${researcher.id}`)}>
              <Image
                  fill
                  src={researcher.image ? `${researcher.image}` : "https://picsum.photos/100/100"}
                  alt="pesquisador"
                  className="rounded-md border border-border object-cover"
                />
            </div>
            <div className="flex px-2 flex-col gap-1 w-full h-full justify-start items-start">
              <DrawerTitle className="text-2xl">{researcher.name}</DrawerTitle>
                <span className="flex items-center gap-1 text-lg text-gray-500">
                  <MapPin size={15} />
                  <p>{researcher.simcc.city ?? "Cidade não disponível"}</p>
                </span>
                <span className="flex items-center gap-1 text-lg text-gray-500">
                  <GraduationCap size={15} />
                  <p>{researcher.simcc.graduation ?? "Graduação não disponível"}</p>
                </span>
                <span className="flex items-center gap-1 text-lg text-gray-500">
                  <School size={15} />
                  <p>{researcher.school ?? "Instituição não disponível"}</p>
                </span>
                  <DrawerDescription className="text-sm pr-4 py-2  font-normal text-justify text-gray-500 overflow-hidden hover:overflow-y-scroll transition-all h-48">

                  
                      {researcher.simcc?.abstract ?? "Descrição não disponível."}

                </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 flex flex-col px-6 py-2 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-full gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <Spinner size="medium">Carregando...</Spinner>
            </div>
          ) : (
            <>
              
              <PesquisadorTabs researcher={researcher}  />
              
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

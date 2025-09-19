import { PesquisadorTabs } from "@/components/pesquisador/PesquisadorTabs";
import { getResearcherById } from "@/core/service/Pesquisador/PesquisadorService";
import { GraduationCap, MapPin} from "lucide-react";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;

}){

    const { id } = await params
    const researcher  = await getResearcherById(id, true);
    if(!researcher) throw new Error("A")
    return(
        <div className="w-full flex flex-col gap-4  p-8 ">
          <div className="flex  gap-4 justify-center">
            <div className="flex  w-1/4 min-h-64 h-full justify-center rounded-lg relative">
              <Image
                fill
                src={researcher.image ? `${researcher.image}` : "https://picsum.photos/100/100"}
                alt="pesquisador"
                className="rounded-md border border-cinza"
              />
            </div>
            <div className="items-center w-full ">
              <h1 className="text-3xl">{researcher.name}</h1>
              {researcher.simcc && (
                <>
             <p className="text-xl flex gap-2"><GraduationCap size={24} />{researcher.simcc.graduation}</p>
              <p className="text-xl flex gap-2"><MapPin size={24}/> {researcher.simcc.city}</p>
              <div className="text-justify text-gray-500 ">
                <p className="text-sm ">
                 {researcher.simcc?.abstract ?? "Descrição não disponível."}
                </p>
              </div>
              </>
              )}
            </div>
          </div>
          <PesquisadorTabs researcher={researcher}/>
          </div>
    )
          

        
}
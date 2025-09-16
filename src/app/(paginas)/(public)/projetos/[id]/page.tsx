import { PesquisadoresLista } from "@/components/pesquisador/PesquisadoresLista";
import { getProjectById } from "@/core/service/ProjetoService";
import { School } from "lucide-react";
import Image from "next/image";
export default  async function Page({
  params,
}: {
  params: Promise<{ id: string }>;

}){
    const { id } = await params
    const project = await getProjectById(id)
    if(!project) throw new Error()
    return(
            <div className="w-full shadow p-8">
                
                    <div className="text-3xl">{project.name}</div>
                    <div className="text=x;">{project.description}</div>
                    <div className="flex flex-row gap-0.5 items-center text-gray-500 mt-2">
                        <School size={16} />
                        <span className="text-sm">{project.school}</span>
                    </div>
                <div className="pl-5 pt-2 overflow-y-auto">
                    <div className="flex flex-row gap-5 py-7 border-b">
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
                    </div>
                    </div>

                    <PesquisadoresLista projectId={project.id}/>
            </div>
    )
}
import { getSchoolById, getSchools } from "@/core/service/School/SchoolService"
import Image from "next/image"
import { EscolaTabs } from "@/components/escola/EscolaTabs"



export default async function Page({
  params,
}: {
  params: { id: string };

}){
    
    const { id } = params
    const school = await getSchoolById(id)
    if(!school) throw new Error("Erro")
    return(
             
                    <div className="flex-1  px-4"> 
                        <div className="flex flex-col gap-4 px-10 mb-5">
                                {/* IMAGEM */}
                                <div className="flex gap-4 items-center">
                                <div className="flex w-4/5 min-h-64 justify-center relative">
                                    <Image fill src={"https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="escola"
                                        className="rounded-sm border-3 shadow-lg border-white">
                                    </Image>
                                </div>
                                
                                <div className="flex flex-col gap-2 text-center">
                                    <div className="text-4xl">{school.name}</div>
                                    <p className="text-3xl font-semibold text-gray-400">{school.city}</p>
                                    <p className="text-3xl font-semibold text-gray-400" >{school.description}</p>
                                </div>
                            </div>
                            </div>
                            <EscolaTabs schoolId={school.id}/>
                        </div>
    )
}
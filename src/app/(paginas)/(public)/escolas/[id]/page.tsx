import { getSchoolById, getSchools, getSchoolStatistics } from "@/core/service/School/SchoolService"
import Image from "next/image"
import { EscolaTabs } from "@/components/escola/EscolaTabs"
import { capitalize } from "@/core/utils/capitalize";



export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;

}){
    
    const { id } = await params
    const school = await getSchoolById(id)
    const schoolStatistics = await getSchoolStatistics(id)
    if(!school) throw new Error("Erro")
    console.log(schoolStatistics)
    return(
             
                    <div className="flex flex-col gap-8  px-10"> 
                        
                        <div className="flex flex-col gap-12 mb-5">
                                {/* IMAGEM */}
                                <div className="flex gap-4 items-center">
                                <div className="flex max-w-92 w-4/5 min-h-64 justify-center rounded-lg relative">
                                    <Image fill src={"https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="escola"
                                        className="rounded-lg p-2 border-3 shadow-lg border-white">
                                    </Image>
                                </div>
                                
                                <div className="flex flex-col gap-2 text-center">
                                    <div className="text-4xl">{school.name}</div>
                                    <p className="text-2xl font-semibold text-gray-400">{school.city}</p>
                                    <p className="text-2xl font-semibold text-gray-400" >{school.description}</p>
                                </div>
                            </div>
                            </div>
                            <div className="flex flex-row w-full gap-8 h-24 justify-between">
                                {schoolStatistics && Object.entries(schoolStatistics).map(([key, value]) => (
                                <div key={key} className="bg-cinza-light rounded-md w-full p-4 flex items-center justify-center text-2xl">
                                        {capitalize(key)}: {value}
                                </div>
                                                    ))}
                            </div>
                            <EscolaTabs schoolId={school.id}/>
                        </div>
    )
}
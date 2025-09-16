"use client"
import CardPesquisador from "./CardPesquisador"
import { capitalize } from "@/core/utils/capitalize"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { getProjectResearchers } from "@/core/service/ProjetoService"
import { Spinner } from "../LoadingSpin"
export const PesquisadoresLista = ({projectId}:{projectId:string}) => {
    const router = useRouter()
    const {data : pesquisadores, isLoading} = useSWR(`project-${projectId}`, () => getProjectResearchers(projectId))
    console.log(pesquisadores)
    return(
    <>
        {isLoading ? <Spinner/> : pesquisadores && Object.keys(pesquisadores).map((key:string ) => {
                                    const items = pesquisadores[key as keyof typeof pesquisadores]
                                    return(
                                        <div key={key} className="flex flex-col gap-2 border-b pb-7 pt-3">
                                        <h2 className="text-2xl font-semibold">{capitalize(key)}</h2>
                                        <div className="flex flex-row gap-5 ">
                                        {items && items.map((p,i) => 
                                                <CardPesquisador 
                                                                key={i}
                                                                researcher={p}
                                                                 />
                                    
                                    
                                        )}
                                        </div>              
                                        </div>
                                    )})}
                                </>                     
                                )       

}

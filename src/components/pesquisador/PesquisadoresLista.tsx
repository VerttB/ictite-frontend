"use client"
import CardPesquisador from "./PesquisadorCard"
import { capitalize } from "@/core/utils/capitalize"
import useSWR from "swr"
import { getProjectResearchers } from "@/core/service/ProjetoService"
import { Spinner } from "../LoadingSpin"
export const PesquisadoresLista = ({projectId}:{projectId:string}) => {
    const {data : pesquisadores, isLoading} = useSWR(`project-${projectId}`, () => getProjectResearchers(projectId))
    return(
    <>
        {isLoading ? <Spinner/> : pesquisadores && Object.keys(pesquisadores).map((key:string ) => {
                                    const items = pesquisadores[key as keyof typeof pesquisadores]
                                    return(
                                        <div key={key} className="flex flex-col gap-2 border-b pb-7 pt-3">
                                        <h2 className="text-2xl font-semibold">{capitalize(key)}</h2>
                                        <div className="grid w-full gap-4 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] ">
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

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Button } from "@/components/ui/button"
import { House, Printer, PanelsTopLeft } from "lucide-react"

import { useState } from "react"
import { useSchoolEquipments, useSchoolProjects, useSchoolResearchers } from "@/hooks/useSchools"
import { Spinner } from "../LoadingSpin"
import CardProjeto from "../card/CardProjeto"
import CardEquipamento from "../card/CardEquipamento"
import CardPesquisador from "../card/CardPesquisador"
import { Researcher } from "@/core/interface/Pesquisador/Researcher"
import Pesquisador from "./Pesquisador"

export const EscolaTabs = ({ schoolId }: { schoolId: string }) => {
  const [activeTab, setActiveTab] = useState("pesquisadores")

  const { researchers, isLoading: loadingRes } = useSchoolResearchers(schoolId)
  const { equipments, isLoading: loadingEq } = useSchoolEquipments(schoolId)
  const { projects, isLoading: loadingPr } = useSchoolProjects(schoolId)

  const [ selectedReseacher, setSelectedResearcher ] = useState<Researcher | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false)
  

  return (
    <>
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex flex-row gap-5 w-full py-2 px-4 rounded-md bg-blue-100">
        <TabsTrigger value="pesquisadores" asChild>
          <Button variant={activeTab === "pesquisadores" ? "default" : "outline"}>
            <House /> Pesquisadores
          </Button>
        </TabsTrigger>
        <TabsTrigger value="equipamentos" asChild>
          <Button variant={activeTab === "equipamentos" ? "default" : "outline"}>
            <Printer /> Equipamentos
          </Button>
        </TabsTrigger>
        <TabsTrigger value="projetos" asChild>
          <Button variant={activeTab === "projetos" ? "default" : "outline"}>
            <PanelsTopLeft /> Projetos
          </Button>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pesquisadores" className="mt-4 flex flex-wrap gap-4">
        {loadingRes ? <Spinner/> :
        researchers?.map((r) => (<CardPesquisador
                                                onClick={() => {setSelectedResearcher(r); setOpenDrawer(true)}}
                                                key={r.name}
                                                researcher={r}/>))}
      </TabsContent>

      <TabsContent value="equipamentos" className="mt-4 flex flex-wrap gap-4">
        {loadingEq ? <Spinner/> : 
        equipments?.map((e,i) => (<CardEquipamento 
                                                  
                                                  key={i}
                                                  equipment={e}/> ))}
      </TabsContent>

      <TabsContent value="projetos" className="mt-4 flex flex-wrap gap-4">
        {loadingPr ? <Spinner/>:
         projects?.map((p,i) =><CardProjeto 
                                          key={i}
                                          project={p}/> )}
      </TabsContent>
    </Tabs>
    </>
  )
}

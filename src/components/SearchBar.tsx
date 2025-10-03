'use client'
import { Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { getSchools } from "@/core/service/SchoolService"
import { getResearchers } from "@/core/service/PesquisadorService"
import { SugestionList } from "./SugestionList"
import { SugestionBase } from "@/core/interface/SugestionBase"
import { getProjects } from "@/core/service/ProjetoService"

interface SearchBarProps {
  onSugestoesChange?: (sugestoes: Record<string, SugestionBase[]>) => void;
}

export const SearchBar = ({ onSugestoesChange }: SearchBarProps) => {
    const [value, setValue ] = useState("")
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [sugestions,setSugestions] = useState<Record<string, SugestionBase[]>>({pesquisadores:[], escolas: [], projetos: []})
    
    const handleValueChange = (e:ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
       
    }

//     function arrayFetcher(...urlArr:string[]) {
//     const f = (u:string) => fetch(u).then((r) => r.json());
//     return Promise.all(urlArr.map(f));
    
// }
    const getData = async (val: string) => {
        const [schools, researchers, projects] = await Promise.all([
            getSchools(val),
            getResearchers(val),
            getProjects(val)
            
    ])


        setSugestions({
            escolas: schools || [],
            pesquisadores: researchers || [],
            projetos : projects || []
        })

        if (onSugestoesChange) {
            onSugestoesChange(sugestions)
        }
    }


    useEffect(() => {
        if(value.length >= 2){
            const debounce = setTimeout(() => {
                getData(value)
            }, 500)
          return () => clearTimeout(debounce)  
        }
        else{
            setSugestions({ escolas: [], pesquisadores: [], projetos: [] });

            if (onSugestoesChange) {
                onSugestoesChange(sugestions)
            }
        }

    },[value])


    const handleSearchClick = () => {
        getData(value)
    }

    return (
        <div className="flex flex-col gap-0"> 

             <div className="relative flex-grow w-full mt-5">
        <Input
            ref={inputRef}
            onChange={handleValueChange}
            value={value}
            type={"search"}
            placeholder="Busca por escola, pesquisador ou projetos" 
            className="px-4 pr-10 py-2 w-full rounded-lg border-2"
         />
        <Button
            onClick={handleSearchClick}
            variant={"ghost"}
            size={"icon"}
            className="absolute right-1 top-1/2 mr-0.25 transform -translate-y-1/2 h-8 w-8 cursor-pointer bg-primary text-white
                      hover:bg-lime-600 hover:text-white transition-colors">
            <Search/>
        </Button>
      </div>
            {value.length >= 2  && (
        <div className="flex  bg-foreground rounded-2xl shadow-2xl max-h-64 py-4 px-8 overflow-auto">
            <SugestionList data={sugestions}/>
            </div>
            )}
            
        
        </div>
    )


}
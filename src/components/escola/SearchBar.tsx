'use client'
import { Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { getSchools } from "@/core/service/School/SchoolService"
import Link from "next/link"
import { SchoolData } from "@/core/interface/School"
export const SearchBar = () => {
    const [value, setValue ] = useState("")
    const [escolas, setEscolas] = useState<SchoolData[]>([])
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [isFocused, setIsFocused] = useState<boolean>()
    const handleValueChange = (e:ChangeEvent<HTMLInputElement>) => {
        setValue(_ => e.target.value)
       
    }

    
    const getescolas = async () => {
        const data = await getSchools(value)
        setEscolas(data || [])
    }
    useEffect(() => {
        if(value.length >= 2){
            const debounce = setTimeout(() => {
                console.log(value)
                getescolas()
                console.log(escolas)
            }, 500)
          return () => clearTimeout(debounce)  
        }
        else{
            setEscolas([])
        }

    },[value])
    return (
        <div className="flex flex-col gap-0"> 

             <div className="relative flex-grow w-full mt-5">
        <Input
            ref={inputRef}
            onChange={handleValueChange}
            value={value}
            type={"search"}
            placeholder="Busca por escola, pesquisador ou projetos" 
            className="pl-4 pr-10 py-2 w-full rounded-lg border-2"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}/>
        <Button
            variant={"ghost"}
            size={"icon"}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 cursor-pointer bg-verde text-white
                      hover:bg-lime-600 hover:text-white transition-colors">
            <Search/>
        </Button>
      </div>
            {escolas.length > 0  && (
                <div className="flex flex-col bg-cinza-light rounded-2xl shadow-2xl max-h-64 py-4 px-8 overflow-auto">
            <div className="flex flex-col gap-4">
                <h3 className="py-2 px-8 rounded-md w-fit bg-blue-100">Escolas</h3>
                <div className="grid grid-cols-2 items-start gap-1 ">
                {escolas.map(e => 
                <Link 
                    href={`escola/${e.id}`} 
                    key={e.id}
                    className="w-full hover:bg-verde py-1 px-4 rounded-md hover:text-white">
                    {e.name}
                </Link>)}
                </div>
            </div> 
            </div>
            )}
            
        
        </div>
    )


}
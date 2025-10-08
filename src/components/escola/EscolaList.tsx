"use client"

import { ChevronRight, School } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getSchools } from "@/core/service/SchoolService";
import Link from "next/link";
import { SugestionBase } from "@/core/interface/SugestionBase";

interface EscolaListProps {
    escolasBusca: SugestionBase[];
}

export default function EscolaList ({escolasBusca}: EscolaListProps) {

    const [schools, setSchools] = useState<SugestionBase[]>([]);


    useEffect(() => {
        // CARREGANDO AS ESCOLAS:  
        const loadSchools = async () => {
           
            try {
                if(escolasBusca && escolasBusca.length !== 0){
                    setSchools(escolasBusca);
                }else{
                    const data = await getSchools();
                    setSchools((data || []).map(d => ({ id: d.id, name: d.name })));
                }
            } catch (err: unknown) {
                console.error("Erro ao buscar escolas:", err);
                setSchools([]);
            } finally {
            }
        };

        loadSchools();
    }, [escolasBusca]);

    return(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
            {schools.map((school) => (
                <div key={school.id} className="flex flex-row justify-between w-full h-12 border-2 rounded-md items-center px-3 py-3">
                    <div className="flex flex-row gap-4 items-center">
                      <School size={24} className="text-primary" />
                      <span className="text-lg line-clamp-1">{school.name}</span>
                    </div>
                    <div className="">
                      <Link href={`/escolas/${school.id}`}>
                          <Button size={"icon"} className="cursor-pointer">
                              <ChevronRight />
                          </Button>
                      </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}
"use client"

import { ChevronRight, School } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { SchoolData } from "@/core/interface/School";
import { getSchools } from "@/core/service/SchoolService";
import Link from "next/link";

export default function EscolaList () {

    const [schools, setSchools] = useState<SchoolData[]>([]);
    const [schoolsLoading, setSchoolsLoading] = useState(false);
    const [schoolsError, setSchoolsError] = useState<string | null>(null);

    useEffect(() => {
        // CARREGANDO AS ESCOLAS:  
        const loadSchools = async () => {
        setSchoolsLoading(true);
        setSchoolsError(null);
        try {
            const data = await getSchools();
            setSchools(data || []);
        } catch (err: unknown) {
            console.error("Erro ao buscar escolas:", err);
            setSchoolsError("Não foi possível carregar as escolas.");
            setSchools([]);
        } finally {
            setSchoolsLoading(false);
        }
        };

        loadSchools();
    }, []);

    return(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
          {schools.map((school) => (
            <div key={school.id} className="flex flex-row justify-between w-full h-14 border-2 rounded-md items-center px-3">
              <div className="flex flex-row gap-4 ">
                <School size={30} className="text-verde" />
                <span className="text-xl line-clamp-1">{school.name}</span>
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
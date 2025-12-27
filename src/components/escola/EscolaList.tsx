"use client";

import { ChevronRight, School } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getSchools } from "@/core/service/SchoolService";
import Link from "next/link";
import { SugestionBase } from "@/core/interface/SugestionBase";

interface EscolaListProps {
    escolasBusca: SugestionBase[];
}

export default function EscolaList({ escolasBusca }: EscolaListProps) {
    const [schools, setSchools] = useState<SugestionBase[]>([]);

    return (
        <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto lg:grid-cols-2">
            {schools.map((school) => (
                <div
                    key={school.id}
                    className="flex h-12 w-full flex-row items-center justify-between rounded-md border-2 px-3 py-3">
                    <div className="flex flex-row items-center gap-4">
                        <School size={24} className="text-primary" />
                        <span className="line-clamp-1 text-lg">
                            {school.name}
                        </span>
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
    );
}

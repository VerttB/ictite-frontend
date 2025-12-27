"use client";

import { ChevronRight, School } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { getSchools } from "@/core/service/SchoolService";
import Link from "next/link";
import { SugestionBase } from "@/core/interface/SugestionBase";

interface GenericListProps {
    searchResult: SugestionBase[];
    path: string,
    icon: React.ReactNode;

}

export const GenericList = ({ searchResult, path, icon }: GenericListProps) => {
    if (!Array.isArray(searchResult) || searchResult.length === 0) {
        return <div>Nenhum resultado encontrado</div>;
}
    return (
        <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto lg:grid-cols-2">
            {searchResult.map((result) => (
                <div
                    key={result.id}
                    className="flex h-12 w-full flex-row items-center justify-between rounded-md border-2 px-3 py-3">
                    <div className="flex flex-row items-center gap-4">
                        {icon}
                        <span className="line-clamp-1 text-lg">
                            {result.name}
                        </span>
                    </div>
                    <div className="">
                        <Link href={`/${path}/${result.id}`}>
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

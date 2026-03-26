"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function MenuSuperiorPagina ({ title } : { title: string }) {

    const router = useRouter();

    return(
        <div className="flex flex-row items-center gap-5">
            <Button size={"icon"} variant={"outline"} className="cursor-pointer"
            onClick={() => router.back()}>
                <ChevronLeft />
            </Button>
            <p className="text-2xl font-semibold">{title}</p>
        </div>
    )
}
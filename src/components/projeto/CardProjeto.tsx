import { Maximize2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import Projeto from "./ProjetoDrawer";
import { Project } from "@/core/interface/Project";

interface ProjectProps {
        onClick?: () => void; 
        project: Project
}

export default function CardProjeto ({project, onClick}: ProjectProps) {

    const [isProjetoDrawerOpen, setIsProjetoDrawerOpen] = useState(false);

    return(
        <>
            <div
                className="p-5 flex flex-col gap-4 border shadow justify-center
                border-l-amber-500 border-l-8 w-80 h-full rounded-md bg-slate-50
                "
                onClick={onClick ?  onClick : () => setIsProjetoDrawerOpen(true)}>
                <div className="flex flex-row justify-between items-center gap-2">
                    <h2 className="text-2xl">{project.name}</h2>
                    <Button variant={"outline"} size={"icon"}  className="cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault()
                            setIsProjetoDrawerOpen(true);
                        }}>
                        <Maximize2 />
                    </Button>
                </div>
                <p className="text-sm text-gray-500 text-justify max-h-28 overflow-y-auto">{project.description}</p>
            
                {/* |=======| DRAWER DO PROJETO |=======| */}
            </div>
            <Projeto isOpen={isProjetoDrawerOpen} project={project} onClose={() => setIsProjetoDrawerOpen(false)}/>
        </>
    );
}
import { Maximize2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import Projeto from "./ProjetoDrawer";
import { Project } from "@/core/interface/Project";

interface ProjectProps {
    onClick?: () => void;
    project: Pick<Project, "id" | "name" | "description">;
}

export default function CardProjeto({ project, onClick }: ProjectProps) {
    const [isProjetoDrawerOpen, setIsProjetoDrawerOpen] = useState(false);

    return (
        <>
            <div
                className="bg-background flex h-full flex-col justify-center gap-4 rounded-md border border-l-8 border-l-amber-500 p-5 shadow"
                onClick={
                    onClick ? onClick : () => setIsProjetoDrawerOpen(true)
                }>
                <div className="flex flex-row items-center justify-between gap-2">
                    <h2 className="text-font-primary text-2xl">
                        {project.name}
                    </h2>
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsProjetoDrawerOpen(true);
                        }}>
                        <Maximize2 />
                    </Button>
                </div>
                <p>{project.description}</p>

                {/* |=======| DRAWER DO PROJETO |=======| */}
            </div>
            <Projeto
                isOpen={isProjetoDrawerOpen}
                project_id={project.id}
                onClose={() => setIsProjetoDrawerOpen(false)}
            />
        </>
    );
}

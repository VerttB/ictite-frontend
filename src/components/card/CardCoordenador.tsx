import { CoordinatorWithClub } from "@/core/domain/Coordinator"
import { BrainCircuit, ScrollText } from "lucide-react";

interface CoordinatorCardProps {
    name : string;
    clube: string;
}

export default function CardCoordenador({ name, clube }: CoordinatorCardProps) {
    return(
        <div className="bg-background flex h-fit justify-between overflow-hidden rounded-md border border-l-8 border-l-purple-800">
            <div className="flex flex-1 flex-col justify-center gap-4 p-5">
                <h2 className="text-font-primary text-2xl font-semibold">
                    {name}
                </h2>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center text-font-secondary">
                        <ScrollText size={20}/>
                        <p className=" max-h-28 overflow-y-auto text-justify text-sm">
                            Coordenador do Clube
                        </p>
                    </div>
                    <div className="flex gap-2 items-center text-font-secondary">
                        <BrainCircuit size={20}/>
                        <p className=" max-h-28 overflow-y-auto text-justify text-sm">
                            {clube}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
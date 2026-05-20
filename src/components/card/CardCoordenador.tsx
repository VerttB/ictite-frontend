import { CoordinatorWithClub } from "@/core/domain/Coordinator"
import { BrainCircuit, ScrollText } from "lucide-react";

interface CoordinatorCardProps {
    coordinator: CoordinatorWithClub;
}

export default function CardCoordenador({ coordinator }: CoordinatorCardProps) {
    return(
        <div className="bg-background flex h-fit justify-between overflow-hidden rounded-md border border-l-8 border-l-purple-800">
            <div className="flex flex-1 flex-col justify-center gap-4 p-5">
                <h2 className="text-font-primary text-2xl font-semibold">
                    {coordinator.name}
                </h2>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center text-font-secondary">
                        <ScrollText size={20}/>
                        <p className=" max-h-28 overflow-y-auto text-justify text-sm">
                            {coordinator.area}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center text-font-secondary">
                        <BrainCircuit size={20}/>
                        <p className=" max-h-28 overflow-y-auto text-justify text-sm">
                            {coordinator.clube.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
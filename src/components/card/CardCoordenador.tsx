import { CoordinatorWithClub } from "@/core/domain/Coordinator"

interface CoordinatorCardProps {
    coordinator: CoordinatorWithClub;
}

export default function CardCoordenador({ coordinator }: CoordinatorCardProps) {
    return(
        <div className="bg-background flex h-fit justify-between overflow-hidden rounded-md border border-l-8 border-l-lime-500">
            <div className="flex flex-1 flex-col justify-center gap-4 p-5">
                <h2 className="text-font-primary text-2xl font-semibold">
                    {coordinator.name}
                </h2>
                <p className="text-font-secondary max-h-28 overflow-y-auto text-justify text-sm">
                    {coordinator.area}
                </p>
                <p className="text-font-secondary max-h-28 overflow-y-auto text-justify text-sm">
                    {coordinator.clube.name}
                </p>
            </div>
        </div>
    )
}
import { Equipment } from "@/core/interface/Equipment";

export default function CardEquipamento ({equipment}:{equipment: Equipment}) {
    return(
        <div className="p-5 flex flex-col gap-4 border justify-center
            border-l-lime-500 border-l-8  h-fit rounded-md bg-background
            ">
            <h2 className="text-2xl font-semibold text-font-primary">{equipment.name}</h2>
            <p className="text-sm text-font-secondary text-justify max-h-28 overflow-y-auto">{equipment.description}</p>
        </div>
    );
}
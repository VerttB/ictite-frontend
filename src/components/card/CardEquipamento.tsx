import { Equipment } from "@/core/interface/Equipment";
import Image from "next/image";

export default function CardEquipamento({
    equipment,
}: {
    equipment: Equipment;
}) {
    console.log(equipment);
    return (
        <div className="bg-background flex h-fit justify-between rounded-md border border-l-8 border-l-lime-500 overflow-hidden">
            <div className="flex flex-col gap-4 justify-center flex-1 p-5">
                <h2 className="text-font-primary text-2xl font-semibold">
                    {equipment.name}
                </h2>
                <p className="text-font-secondary max-h-28 overflow-y-auto text-justify text-sm">
                    {equipment.type_equipment.name}
                </p>
            </div>
            <div className="relative w-[140px] flex-shrink-0">
                <Image  src={equipment.images[0].url} alt={equipment.name} fill
                    className=" object-cover object-center rounded-r-md" />
            </div>
        </div>
    );
}

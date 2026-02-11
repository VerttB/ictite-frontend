import { Equipment } from "@/core/domain/Equipment";
import Image from "next/image";

export default function CardEquipamento({ equipment }: { equipment: Equipment }) {
    return (
        <div className="bg-background flex h-fit justify-between overflow-hidden rounded-md border border-l-8 border-l-lime-500">
            <div className="flex flex-1 flex-col justify-center gap-4 p-5">
                <h2 className="text-font-primary text-2xl font-semibold">
                    {equipment.name}
                </h2>
                <p className="text-font-secondary max-h-28 overflow-y-auto text-justify text-sm">
                    {equipment.type_equipment.name}
                </p>
            </div>
            <div className="relative w-[140px] flex-shrink-0">
                <Image
                    src={equipment.images[0].url}
                    alt={equipment.name}
                    fill
                    className="rounded-r-md object-cover object-center"
                />
            </div>
        </div>
    );
}

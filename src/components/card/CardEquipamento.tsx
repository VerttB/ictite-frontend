import { Equipment } from "@/core/interface/Equipment";

export default function CardEquipamento({
    equipment,
}: {
    equipment: Equipment;
}) {
    return (
        <div className="bg-background flex h-fit flex-col justify-center gap-4 rounded-md border border-l-8 border-l-lime-500 p-5">
            <h2 className="text-font-primary text-2xl font-semibold">
                {equipment.name}
            </h2>
            <p className="text-font-secondary max-h-28 overflow-y-auto text-justify text-sm">
                {equipment.type}
            </p>
        </div>
    );
}

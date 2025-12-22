import { EquipmentAdm } from "@/components/console/EquipamentAdm";
import { EquipmentSearchParamsSchema } from "@/core/domain/Equipment";

interface EquipmentPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: EquipmentPageProps) {
    const parsedParams = EquipmentSearchParamsSchema.parse(searchParams);
    return <EquipmentAdm params={parsedParams} />;
}

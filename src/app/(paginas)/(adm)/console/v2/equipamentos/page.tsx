import { EquipmentAdm } from "@/components/console/EquipamentAdm";
import { EquipmentSearchParamsSchema } from "@/core/domain/Equipment";

interface EquipmentPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: EquipmentPageProps) {
    const params = await searchParams;
    const parsedParams = EquipmentSearchParamsSchema.parse(params);
    return <EquipmentAdm params={parsedParams} />;
}

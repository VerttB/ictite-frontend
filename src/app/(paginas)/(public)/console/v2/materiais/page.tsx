import { MaterialAdm } from "@/components/console/MaterialAdm";
import { MaterialSearchParamsSchema } from "@/core/domain/Material";

interface MaterialPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: MaterialPageProps) {
    const params = await searchParams;
    const parsedParams = MaterialSearchParamsSchema.parse(params);
    return <MaterialAdm params={parsedParams} />;
}

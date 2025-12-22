import { MaterialAdm } from "@/components/console/MaterialAdm";
import { MaterialSearchParamsSchema } from "@/core/domain/Material";

interface MaterialPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: MaterialPageProps) {
    const parsedParams = MaterialSearchParamsSchema.parse(searchParams);
    return <MaterialAdm params={parsedParams} />;
}

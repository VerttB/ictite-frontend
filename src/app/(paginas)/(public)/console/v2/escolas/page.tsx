import { SchoolAdm } from "@/components/console/SchoolAdm";
import { SchoolSearchParamsSchema } from "@/core/domain/School";

interface SchoolPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: SchoolPageProps) {
    const parsedParams = SchoolSearchParamsSchema.parse(searchParams);
    return <SchoolAdm params={parsedParams} />;
}

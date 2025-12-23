import { SchoolAdm } from "@/components/console/SchoolAdm";
import { SchoolSearchParamsSchema } from "@/core/domain/School";

interface SchoolPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: SchoolPageProps) {
    const params = await searchParams;
    const parsedParams = SchoolSearchParamsSchema.parse(params);
    return <SchoolAdm params={parsedParams} />;
}

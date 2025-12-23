import { ResearcherAdm } from "@/components/console/ResearcherAdm";
import { ResearcherSearchParamsSchema } from "@/core/domain/Researcher";

interface ResearchersPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: ResearchersPageProps) {
    const params = await searchParams;
    const parsedParams = ResearcherSearchParamsSchema.parse(params);
    return <ResearcherAdm params={parsedParams} />;
}

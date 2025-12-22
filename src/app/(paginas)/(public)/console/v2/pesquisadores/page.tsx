import { ResearcherAdm } from "@/components/console/ResearcherAdm";
import { ResearcherSearchParamsSchema } from "@/core/domain/Researcher";

interface ResearchersPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: ResearchersPageProps) {
    const parsedParams = ResearcherSearchParamsSchema.parse(searchParams);
    return <ResearcherAdm params={parsedParams} />;
}

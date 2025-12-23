import { ProjectAdm } from "@/components/console/ProjectAdm";
import { ProjectSearchParams, ProjectSearchParamsSchema } from "@/core/domain/Project";

interface ProjectPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: ProjectPageProps) {
    const parsedParams = ProjectSearchParamsSchema.parse(searchParams);
    return <ProjectAdm params={parsedParams} />;
}

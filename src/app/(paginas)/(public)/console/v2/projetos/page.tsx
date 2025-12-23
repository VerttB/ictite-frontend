import { ProjectAdm } from "@/components/console/ProjectAdm";
import { ProjectSearchParamsSchema } from "@/core/domain/Project";

interface ProjectPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: ProjectPageProps) {
    const params = await searchParams;
    const parsedParams = ProjectSearchParamsSchema.parse(params);
    return <ProjectAdm params={parsedParams} />;
}

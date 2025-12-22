import { ProjectAdm } from "@/components/console/ProjectAdm";
import { ProjectSearchParams } from "@/core/domain/Project";

interface ProjectPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: ProjectPageProps) {
    const parsedParams: ProjectSearchParams = {};
    return <ProjectAdm params={parsedParams} />;
}

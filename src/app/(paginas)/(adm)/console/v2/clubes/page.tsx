import { ClubAdm } from "@/components/console/ClubAdm";
import { ScienceClubSearchParamsSchema } from "@/core/domain/Club";

interface ClubsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: ClubsPageProps) {
    const params = await searchParams;
    const parsedParams = ScienceClubSearchParamsSchema.parse(params);
    return <ClubAdm params={parsedParams} />;
}

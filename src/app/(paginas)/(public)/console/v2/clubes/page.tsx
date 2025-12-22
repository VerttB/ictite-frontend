import { ClubAdm } from "@/components/console/ClubAdm";
import { ScienceClubSearchParamsSchema } from "@/core/domain/Club";

interface ClubsPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: ClubsPageProps) {
    const parsedParams = ScienceClubSearchParamsSchema.parse(searchParams);
    return <ClubAdm params={parsedParams} />;
}

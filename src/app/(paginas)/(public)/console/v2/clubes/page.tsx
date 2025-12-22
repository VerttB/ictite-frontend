import { ClubAdm } from "@/components/console/ClubAdm";
import { ScienceClubSearchParams } from "@/core/domain/Club";

interface ClubsPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: ClubsPageProps) {
    const parsedParams: ScienceClubSearchParams = {
        name:
            typeof searchParams.name === "string"
                ? searchParams.name
                : undefined,
        school:
            typeof searchParams.school === "string"
                ? searchParams.school
                : undefined,
    };
    return <ClubAdm params={parsedParams} />;
}

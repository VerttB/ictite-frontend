import { MagazineAdm } from "@/components/console/MagazineAdm";
import { MagazineSearchParamsSchema } from "@/core/domain/Magazine";

interface MagazinePageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: MagazinePageProps) {
    const parsedParams = MagazineSearchParamsSchema.parse(searchParams);
    return <MagazineAdm params={parsedParams} />;
}

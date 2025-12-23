import { MagazineAdm } from "@/components/console/MagazineAdm";
import { MagazineSearchParamsSchema } from "@/core/domain/Magazine";

interface MagazinePageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: MagazinePageProps) {
    const params = await searchParams;
    const parsedParams = MagazineSearchParamsSchema.parse(params);
    return <MagazineAdm params={parsedParams} />;
}

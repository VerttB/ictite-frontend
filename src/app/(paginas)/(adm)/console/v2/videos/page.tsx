interface VideoPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: VideoPageProps) {
    return <div>Em construção...</div>;
    // const parsedParams = VideoSearchParams.parse(searchParams);
    // return <VideoAdm params={parsedParams} />;
}

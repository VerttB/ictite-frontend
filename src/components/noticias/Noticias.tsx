"use client";

import { useState } from "react";
import CardNoticias from "./CardNoticias";
import CardSecundariaNoticias from "./CardSecundariaNoticias";
import { InstagramPost } from "@/core/domain/Instagram";
import { getInstagramPosts } from "@/core/service/InstagramService";
import useSWR from "swr";

export default function Noticias() {
    const { data: posts, isLoading } = useSWR("instagramPosts", () =>
        getInstagramPosts()
    );
    const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

    if (isLoading) return <div>Carregando notícias...</div>;
    if (posts?.length === 0)
        return (
            <div className="border-muted-foreground/40 bg-muted/10 text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-md border border-dashed py-5">
                <span>Nenhuma noticia encontrada</span>
            </div>
        );
    if (posts?.length && !selectedPost) setSelectedPost(posts[0]);
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[60%_40%]">
            {/* |=======| DESTAQUE (GRANDE) |=======| */}
            <div className="h-full">
                {selectedPost && <CardNoticias post={selectedPost} />}
            </div>

            {/* |=======| LISTA LATERAL |=======| */}
            <div className="flex flex-col justify-between gap-3">
                {posts?.slice(0, 3).map((post) => (
                    <CardSecundariaNoticias
                        key={post.id}
                        post={post}
                        isSelected={selectedPost?.id === post.id}
                        onSelect={() => setSelectedPost(post)}
                    />
                ))}
            </div>
        </div>
    );
}

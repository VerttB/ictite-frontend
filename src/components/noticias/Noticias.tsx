"use client"; // Se estiver usando Next.js App Router

import { useEffect, useState } from "react";
import CardNoticias from "./CardNoticias";
import CardSecundariaNoticias from "./CardSecundariaNoticias";
import { InstagramPost } from "@/core/domain/Instagram";
import { getInstagramPosts } from "@/core/service/InstagramService";

export default function Noticias() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getInstagramPosts();
                setPosts(data);
                if (data.length > 0) {
                    setSelectedPost(data[0]); 
                }
            } catch (error) {
                console.error("Erro ao carregar notícias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div>Carregando notícias...</div>;
    if (posts.length === 0) return <div>Nenhuma notícia encontrada.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-4">
            {/* |=======| DESTAQUE (GRANDE) |=======| */}
            <div className="h-full">
                {selectedPost && <CardNoticias post={selectedPost} />}
            </div>

            {/* |=======| LISTA LATERAL |=======| */}
            <div className="flex flex-col gap-3 justify-between">
                {posts.slice(0, 3).map((post) => (
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
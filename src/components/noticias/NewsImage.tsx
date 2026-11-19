"use client";

import Image from "next/image";
import { useState } from "react";
import { getAssetPrefix } from "@/core/utils/api";

export function NewsImage({
    src,
    alt,
    width,
    height,
    className,
}: {
    src?: string | null;
    alt: string;
    width: number;
    height: number;
    className?: string;
}) {
    const [failed, setFailed] = useState(false);
    const fallback = `${getAssetPrefix()}/logoImagem.png`;
    return (
        <Image
            src={!src || failed ? fallback : src}
            alt={failed ? `${alt} — imagem indisponível` : alt}
            width={width}
            height={height}
            className={className}
            onError={() => setFailed(true)}
        />
    );
}

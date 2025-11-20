"use client";

import { Button } from "@/components/ui/button";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="bg-foreground flex min-h-screen w-full flex-col items-center justify-center gap-4">
            <h1 className="text-center text-3xl font-bold text-black">
                Ocorreu um erro ao processar seu pedido
            </h1>
            <p>
                Não foi possível conectar ao servidor do ICTITE. Verifique sua
                conexão ou tente novamente mais tarde.{" "}
            </p>

            <Button onClick={() => reset()}>Tentar Novamente</Button>
        </div>
    );
}

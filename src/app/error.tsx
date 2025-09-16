"use client"

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}){
    return(
        <div className="min-h-screen w-full flex flex-col gap-4 justify-center items-center bg-cinza-light">
         <h1 className="text-center text-black text-3xl font-bold">Ocorreu um erro ao processar seu pedido</h1>
          <p>
            Não foi possível conectar ao servidor do ICTITE. Verifique sua
            conexão ou tente novamente mais tarde.{" "}
          </p>

          <Button onClick={() => reset()}>
            Tentar Novamente
          </Button>
        </div>
    )
}
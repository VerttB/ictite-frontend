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
        <div className="min-h-screen w-full bg-cinza-light">
         <h1 className="text-center text-3xl font-bold">Ocorreu um erro ao processar seu pedido</h1>
          <p>
            Não foi possível conectar ao servidor do AgroDoa. Verifique sua
            conexão ou tente novamente mais tarde.{" "}
          </p>

          <Button onClick={() => reset()}>
            Tentar Novamente
          </Button>
        </div>
    )
}
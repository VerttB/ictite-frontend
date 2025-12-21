import { Funnel, Rocket, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export default function CardCategoriaMateriais() {
  return (
    <div className="relative flex flex-col gap-4 p-6 border border-border bg-background rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-[320px] overflow-hidden">
      {/* Ícone e título */}
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
                <Rocket className="text-primary" size={24} />
            </div>
                <h2 className="text-xl font-semibold">
                    Nome da Categoria
                </h2>
        </div>

        {/* Informações e ações */}
        <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
                <span className="bg-secondary  px-4 py-2 rounded-md font-medium text-white hover:scale-95 cursor-pointer transition-all">
                    4 materiais
                </span>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 border cursor-pointer">
                <Funnel size={20} />
            </Button>
        </div>

        {/* Ícone decorativo */}
        <Sparkles
            size={112}
            className="absolute -right-4 -bottom-4 text-primary/30 pointer-events-none "
        />
    </div>
  );
}

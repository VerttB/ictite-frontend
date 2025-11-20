import React from "react";
import CardMateriais from "@/components/card/CardMateriais";
import { Button } from "@/components/ui/button";
import { BookText, ChevronLeft } from "lucide-react";

export default function Materiais() {
    return (
        <div className="flex w-full flex-col gap-8 py-4 sm:px-8">
            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <div className="flex flex-row items-center gap-5">
                <Button
                    size={"icon"}
                    variant={"outline"}
                    className="cursor-pointer">
                    <ChevronLeft />
                </Button>
                <p className="text-2xl font-semibold">Materiais Didáticos</p>
            </div>

            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className="bg-primary mx-4 mt-4 flex flex-col gap-3 rounded-md border border-blue-100 p-4 text-white shadow-sm">
                <div className="flex flex-col gap-0">
                    <h2 className="flex items-center gap-1 text-xl font-semibold">
                        <BookText size={18} />
                        Materias Educativos e Intuitivos
                    </h2>
                </div>
                <p className="text-sm sm:text-base">
                    Explore recursos educativos desenvolvidos para transformar o
                    ensino de ciências e tecnologia na Bahia. Oferecemos planos
                    de aula, kits experimentais e guias práticos sobre robótica,
                    energias renováveis e inovação, todos alinhados à realidade
                    local e de acesso gratuito. Ideal para professores e
                    estudantes, nossos materiais incentivam aprendizagem mão na
                    massa e abordagem investigativa.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <div className="text-2xl font-semibold">
                    <h2>Categorias</h2>
                </div>
                <div className="grid grid-cols-1 justify-items-center gap-2 py-4 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CardMateriais key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

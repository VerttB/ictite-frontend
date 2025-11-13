import React from 'react';
import CardMateriais from "@/components/card/CardMateriais";
import { Button } from "@/components/ui/button";
import { BookText, ChevronLeft } from "lucide-react";

export default function Materiais () {
    return(
        <div className="flex flex-col gap-8 w-full  sm:px-8 py-4">
            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <div className="flex flex-row gap-5 items-center">
                <Button size={"icon"} variant={"outline"} className="cursor-pointer"><ChevronLeft /></Button>
                <p className="text-2xl font-semibold">Materiais Didáticos</p>
            </div>

            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className=" flex flex-col gap-3 bg-primary text-white
                      p-4 mx-4 mt-4 rounded-md shadow-sm border border-blue-100
            ">
                <div className="flex flex-col gap-0">
                    <h2 className="text-xl font-semibold flex gap-1 items-center">
                        <BookText size={18}/>
                        Materias Educativos e Intuitivos
                    </h2>
                </div>
                <p className='text-sm sm:text-base'>Explore recursos educativos desenvolvidos para transformar o ensino de ciências e tecnologia na Bahia. Oferecemos 
                    planos de aula, kits experimentais e guias práticos sobre robótica, energias renováveis e inovação, todos 
                    alinhados à realidade local e de acesso gratuito. Ideal para professores e estudantes, nossos materiais incentivam 
                    aprendizagem mão na massa e abordagem investigativa.</p>
            </div>
            <div className="flex flex-col gap-2">
                <div className="text-2xl font-semibold"><h2>Categorias</h2></div>
                <div className="grid py-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 justify-items-center">
                    {Array.from({length : 4}).map((_, i) => (
                        <CardMateriais key={i}/>
                    ))}
                </div>
            </div>
        </div>
    );
}
import { Button } from "@/components/ui/button";
import { BookText, ChevronLeft } from "lucide-react";

export default function Materiais () {
    return(
        <div className="flex flex-col gap-8 w-full px-8 py-4">
            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <div className="flex flex-row gap-5 items-center">
                <Button size={"icon"} variant={"outline"} className="cursor-pointer"><ChevronLeft /></Button>
                <p className="text-2xl font-semibold">Materiais Didáticos</p>
            </div>

            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className=" flex flex-col gap-3 bg-verde text-white
                     p-4 mx-4 mt-4 rounded-md shadow-sm border border-blue-100
            ">
                <div className="flex flex-col gap-0">
                    <h2 className="text-xl font-semibold flex gap-1 items-center">
                        <BookText size={18}/>
                        Materias Educativos e Intuitivos
                    </h2>
                </div>
                <p>Explore recursos educativos desenvolvidos para transformar o ensino de ciências e tecnologia na Bahia. Oferecemos 
                    planos de aula, kits experimentais e guias práticos sobre robótica, energias renováveis e inovação, todos 
                    alinhados à realidade local e de acesso gratuito. Ideal para professores e estudantes, nossos materiais incentivam 
                    aprendizagem mão na massa e abordagem investigativa. Em breve: novidades em realidade virtual e impressão 3D para 
                    educação.</p>
            </div>
        </div>
    );
}
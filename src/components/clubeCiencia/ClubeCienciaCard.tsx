import { School } from "lucide-react";
import Image from "next/image";

export default function ClubeCienciaCard () {
    return(
        <div className="flex flex-col gap-1 rounded-md border w-[300px]">
            <div>
                <Image src={"https://picsum.photos/300/190"} alt={"Clube Ciência"} width={300} height={200}
                className="object-cover rounded-t-md"></Image>
            </div>
            <div className="p-3">
                <h1 className="text-xl font-semibold line-clamp-1">Nome do Clube de Ciência</h1>
                <div className=" flex gap-2 items-center text-primary">
                    <School  size={20}/>
                    <p>Nome Completo da Escola</p>
                </div>
            </div>
        </div>
    )
}
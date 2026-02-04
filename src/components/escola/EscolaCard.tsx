import { Folder, MapPin, Users } from "lucide-react";
import Image from "next/image";

export default function EscolaCard () {
    return (
        <div className="flex flex-col gap-1 w-[300px] border rounded-md transition-all hover:scale-[102%] hover:shadow-md cursor-pointer">

            {/* |=======| IMAGEM DA ESCOLA |=======| */}
            <div className="relative h-[200px] w-full overflow-hidden rounded-t-md">
                <Image
                    src={"https://picsum.photos/300/190"}
                    alt={"Escola"}
                    fill
                    className="rounded-t-md object-cover"></Image>

                <div className="absolute top-2 left-2 bg-primary px-2 py-1 rounded-md">
                    <div className="flex text-white text-sm items-center gap-1">
                        <MapPin size={15}/>
                        <span>Cidade</span>
                    </div>
                </div>
            </div>

            {/* |=======| INFORMAÇÕES DA ESCOLA |=======| */}
            <div className="flex flex-col gap-4 py-3 px-2">
                <div>
                    <h1 className="line-clamp-1 text-xl font-semibold">
                        Nome da escola
                    </h1>
                </div>
                <div className="flex gap-4 text-xs items-center text-gray-500">
                    <div className="flex gap-1 items-center ">
                        <Users />
                        <span>10</span>
                    </div>
                    <div className="flex gap-1 items-center ">
                        <Folder />
                        <span>10</span>
                    </div>
                </div>
            </div>

        </div>
    )
}
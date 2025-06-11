import { Book } from "lucide-react";
import Image from "next/image";

export default function CardPesquisador () {
    return(
        <div className="">
            <div className="relative">
                <Image width={200} height={200} src={"https://picsum.photos/200/200"} alt="pesquisador"
                    className="rounded-md border-4 border-cinza"
                ></Image>

                <div className="absolute top-25 left-0 w-full p-2">
                    <h2 className="text-white font-bold drop-shadow-md">Nome do pesquisador</h2>
                    <div className="flex flex-row gap-3 w-fit rounded-md bg-vermelho p-3"> <Book/> <p>Professor</p> </div>
                </div>
            </div>
        </div>
    );
}
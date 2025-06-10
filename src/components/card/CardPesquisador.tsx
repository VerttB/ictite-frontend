import { Book } from "lucide-react";

export default function CardPesquisador () {
    return(
        <div>
            <div className="flex flex-col px-1 py-4 h-56 w-56 justify-end bg-gray-300">
                <h2 className="">Nome do pesquisador</h2>
                <div className="flex flex-row gap-3 w-fit rounded-md bg-vermelho p-3"> <Book/> <p>Professor</p> </div>
            </div>
        </div>
    );
}
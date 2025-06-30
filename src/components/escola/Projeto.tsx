import { School, X } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import Image from "next/image";

interface ProjetoProps {
    isOpen: boolean;
    onClose: (open:boolean) => void;
}

export default function Projeto ({ isOpen, onClose } : ProjetoProps) {
    return(
        <Drawer open={isOpen} onOpenChange={onClose} direction="right" >
            <DrawerContent className="w-full">
                <DrawerHeader>
                    <div className="flex justify-start border-b items-center pb-2.5">
                        <Button variant={"outline"} size={"icon"} onClick={() => onClose(false)}><X/></Button>
                    </div>
                    <DrawerTitle className="text-2xl">Nome do Projeto</DrawerTitle>
                    <DrawerDescription>Descrição do Projeto: Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam dolores, officia quidem hic culpa enim quae cumque autem provident temporibus labore quibusdam, tempore odit omnis ducimus inventore voluptate obcaecati modi!</DrawerDescription>
                    {/* NOME DA ESCOLA */}
                    <div className="flex flex-row gap-0.5 items-center text-gray-500 mt-2">
                        <School size={16} />
                        <span className="text-sm">Nome da Escola</span>
                    </div>
                </DrawerHeader>

                {/* BODY DOS PESQUISADORES */}
                <div className="pl-5 pt-2">
                    {/* IMAGENS DO PROJETO */}
                    <div className="flex flex-row gap-5 py-7 border-t border-b">
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={100} height={100}></Image>
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={100} height={100}></Image>
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={100} height={100}></Image>
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={100} height={100}></Image>
                    </div>
                </div>

            </DrawerContent>
            
        </Drawer>
    );
}
import MapaComDrawer from "@/components/MapaComDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
//import { GETictite } from "@/core/service/ICTITEService";

export default async function ProjetoPage() {
  //const projeto: IIctite = await GETictite();
  return (
    <div className="w-full px-8 flex flex-col gap-4 space-between rounded-xl">
      <div className="flex flex-row w-full gap-4">
        <div 
          className="
            sm:text-sm md:text-xl text-justify
            rounded-md w-full bg-cinza-light
            px-4 py-6 border-2 indent-4
          "
        >
          <h1 className="">{/*projeto.objective || */"O objetivo da Rede Interdisciplinar de Ciência, Tecnologia e Inovação em Territórios Escolares (Rede-ICTITE) é promover a popularização da ciência e fortalecer a educação científica e para a saúde nas redes estadual e municipais de ensino da Bahia, por meio da construção colaborativa de uma rede integrada de professores, estudantes e instituições, estimulando o protagonismo jovem e ampliando o alcance das ações educativas e de divulgação científica nos territórios escolares."}</h1>
        </div>
      </div>

      <div className="relative flex-grow w-full mt-5">
        <Input type={"search"} placeholder="Busca por escola, pesquisador ou projetos" 
            className="pl-4 pr-10 py-2 w-full rounded-lg border-2"/>
        <Button variant={"ghost"} size={"icon"}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 cursor-pointer">
            <Search/>
        </Button>
      </div>

      <div className="flex flex-col gap-1 h-full w-full p-2 mt-5 
        border-2 bg-cinza-light rounded-md">
        <div className="flex flex-row gap-2 justify-end items-center text-sm">
          <p className="border-l-2 pl-2">Total de escolas: XX</p>
          <p className="border-l-2 pl-2">Total de pesquisadores: XX</p>
          <p className="border-l-2 pl-2">Total de projetos: XX</p>
        </div>
        <MapaComDrawer />
      </div>

    </div>
  );
}

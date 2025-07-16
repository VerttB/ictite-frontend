import MapaComDrawer from "@/components/MapaComDrawer";
import { GETictite } from "@/core/service/ICTITEService";

export default async function ProjetoPage() {
  const projeto: IIctite = await GETictite();
  return (
    <div className="w-full p-8 flex flex-col space-between rounded-xl">
      <div className="flex flex-row w-full gap-4">
        <div className=" sm:text-sm md:text-xl text-justify rounded-xl w-full bg-cinza-light px-4 py-6  shadow-xl">
          <h1 className="">{projeto.objective || "O objetivo da Rede Interdisciplinar de Ciência, Tecnologia e Inovação em Territórios Escolares (Rede-ICTITE) é promover a popularização da ciência e fortalecer a educação científica e para a saúde nas redes estadual e municipais de ensino da Bahia, por meio da construção colaborativa de uma rede integrada de professores, estudantes e instituições, estimulando o protagonismo jovem e ampliando o alcance das ações educativas e de divulgação científica nos territórios escolares."}</h1>
        </div>
      </div>

      <div className="h-full w-full p-4">
        <MapaComDrawer />
      </div>

    
    </div>
  );
}

import MapaRender from "@/components/Mapa";      
import MapaComDrawer from "@/components/MapaComDrawer";
import Escola from "@/components/escola/Escola";
import { GETictite } from "@/core/service/ICTITEService";

export default async function ProjetoPage() {
  const projeto: IIctite = await GETictite();
  return (
    <div className="w-full p-8 flex flex-col space-between rounded-xl">
      <h1 className="h-16 text-xl rounded-xl bg-cinza-light p-4">{projeto.objective}</h1>

      <div className="h-full w-full p-4">
        <MapaComDrawer />
      </div>

    
    </div>
  );
}

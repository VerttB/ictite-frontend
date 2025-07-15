import MapaComDrawer from "@/components/MapaComDrawer";
//import { GETictite } from "@/core/service/ICTITEService";

export default async function ProjetoPage() {
 // const projeto: IIctite = await GETictite();
  return (
    <div className="w-full p-8 flex flex-col space-between rounded-xl">
      <div className="flex flex-row w-full gap-4">
        <div className="h-32 sm:text-sm md:text-3xl rounded-xl bg-vermelho p-4 w-64 shadow-xl
                        flex justify-center items-center font-bold
        ">
          <h1>ICTITE</h1>
        </div>
        <div className="h-32 sm:text-sm md:text-xl text-justify rounded-xl w-full bg-cinza-light p-4 overflow-y-auto shadow-xl">
          <h1 className="h-16">{/*projeto.objective*/} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus accusamus impedit fugit voluptate? Sint porro odio beatae consectetur sequi, iste assumenda pariatur quis asperiores non. Perspiciatis debitis fugit animi suscipit?</h1>
        </div>
      </div>

      <div className="h-full w-full p-4">
        <MapaComDrawer />
      </div>

    
    </div>
  );
}

import MapaComDrawer from "@/components/MapaComDrawer";
//import { GETictite } from "@/core/service/ICTITEService";

export default async function ProjetoPage() {
 // const projeto: IIctite = await GETictite();
  return (
    <div className="w-full p-8 flex flex-col space-between rounded-xl">
      <h1 className="h-16 text-xl text-justify rounded-xl bg-cinza-light p-4">{/*projeto.objective*/} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus accusamus impedit fugit voluptate? Sint porro odio beatae consectetur sequi, iste assumenda pariatur quis asperiores non. Perspiciatis debitis fugit animi suscipit?</h1>

      <div className="h-full w-full p-4">
        <MapaComDrawer />
      </div>

    
    </div>
  );
}

import { ClubeAdm } from "@/components/console/ClubeAdm";
import { MaterialAdm } from "@/components/console/MaterialAdm";
import { RevistaAdm } from "@/components/console/RevistaAdm";
import { VideoAdm } from "@/components/console/VideoAdm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Club } from "lucide-react";


export default function Page() {
  return  <div className="flex flex-col gap-8 w-full  sm:px-8 py-4">
            <div className="flex flex-row gap-5 items-center">
                <Button size={"icon"} variant={"outline"} className="cursor-pointer"><ChevronLeft /></Button>
                <p className="text-2xl font-semibold">Módulo Administrativo</p>
            </div>
            <div className="flex flex-col gap-4">
              <ClubeAdm/>
              <MaterialAdm />
              <VideoAdm />
              <RevistaAdm />  
            </div>
            </div>;
}
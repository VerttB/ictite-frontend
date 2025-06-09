import { MapPin } from "lucide-react";
import { Drawer } from "../ui/drawer";

export default function Escola () {
    return(
        <div>
            <Drawer>
                <div className="flex flex-row gap-3 items-center h-fit w-fit hover:scale-[105%] hover:cursor-pointer transition-all duration-200 p-2 rounded">
                    <MapPin/>
                    <p className="text-xl">Salvador-BA</p>
                </div>
            </Drawer>
        </div>
    );
}
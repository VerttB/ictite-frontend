import { SimpleIdName } from "./Commom";
import { Image } from "./Image";

export interface Equipment {
    id: string;
    name: string;
    type_equipment: SimpleIdName;
    school: SimpleIdName;
    images: Image[];
}

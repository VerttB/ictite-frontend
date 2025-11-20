import { Image } from "./Image";

export interface Equipment {
    id: string;
    name: string;
    type: string;
    images: Image[];
}

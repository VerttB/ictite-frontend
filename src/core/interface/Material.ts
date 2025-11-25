import { Image } from "./Image";

export interface Material {
    id: string;
    name: string;
    description: string;
    link: string;
    images?: Image[];
}

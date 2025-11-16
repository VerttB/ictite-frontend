import { Image } from "./Image";

export interface Material {
    id: string;
    title: string;
    description: string;
    link: string;
    images?: Image[];
}   
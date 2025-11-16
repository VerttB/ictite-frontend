import { Image } from "./Image";

export interface Revista{
    id: string;
    title: string;
    description: string;
    link: string;
    images?: Image[];
}
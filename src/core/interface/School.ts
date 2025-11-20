import { Image } from "./Image";

export interface SchoolData {
    id: string;
    name: string;
    city: string;
    description: string;
    images: Image[];
}

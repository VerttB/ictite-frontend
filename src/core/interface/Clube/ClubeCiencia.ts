import { Image } from "../Image";

export interface ClubeCiencia {
    id: string;
    name: string;
    description: string;
    school: {
        id: string;
        name: string;}
    images: Image[];
}

export interface ClubeCienciaPOST extends Omit<ClubeCiencia, "id" | "school"> {
    school_id: string;
}

import { ClubeCiencia } from "./Clube/ClubeCiencia";
import { Image } from "./Image";

export interface School {
    id: string;
    name: string;
    city: string;
    cep: string;
    images: Image[];
    description: string;
}


export interface SchoolCreate extends Omit<School, "id" | "images" | "city"> {}

export interface SchoolWithClubes extends School {
    clubes: Pick<ClubeCiencia, "id" | "name">[];
}
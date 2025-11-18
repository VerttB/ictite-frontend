import { Image } from "../Image";

export interface ClubeCiencia {
    id: string;
    title: string;
    description: string;
    school: string;
    images: Image[];
}

export interface ClubeCienciaPOST extends Omit<ClubeCiencia, 'id' | 'school'> {
    school_id: string;
}
import { Image } from "../Image";
import { School } from "../School";

export interface ClubeCiencia {
    id: string;
    name: string;
    description: string;
    school: Pick<School, "id" | "name">;
    images: Image[];
}

export interface ClubeCienciaPOST extends Omit<ClubeCiencia, "id" | "school"> {
    school_id: string;
}

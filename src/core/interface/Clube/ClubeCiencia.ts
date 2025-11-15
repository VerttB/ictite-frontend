export interface ClubeCiencia {
    id: string;
    title: string;
    description: string;
    school: string;
    images?: string[];
}

export interface ClubeCienciaPOST {
    title: string;
    description: string;
    school_id: string;
    images?: string[];
}
import { Equipment } from "@/core/interface/Equipment";

import { School, SchoolCreate, SchoolWithClubes } from "@/core/interface/School";
import { getBaseUrl } from "@/core/utils/api";
import { ClubeCiencia } from "../interface/Clube/ClubeCiencia";

export const getSchoolGeoData = async () => {
    try {
        const res = await fetch(`${getBaseUrl()}/schools/geojson`);

        if (!res.ok) {
            throw new Error(`Erro na buca: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        return data;
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return null;
    }
};

export const getSchoolById = async (
    id: string,
): Promise<SchoolWithClubes | null> => {
    try {
        const res = await fetch(`${getBaseUrl()}/schools/${id}`);

        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        return data;
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return null;
    }
};

export const getSchools = async (
    name: string = "",
    city: string = ""
): Promise<School[]> => {
    try {
        const res = await fetch(
            `${getBaseUrl()}/schools/?name=${name}&city=${city}`
        );

        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        return data;
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return [];
    }
};


export const getSchoolEquiments = async (id: string): Promise<Equipment[]> => {
    try {
        const res = await fetch(`${getBaseUrl()}/schools/${id}/equipments`);

        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const data = res.json();

        return data;
    } catch (e) {
        console.error("Falha ao buscar equipamentos de escolas:", e);
        return [];
    }
};

// export const getSchoolStatistics = async (
//     id: string
// ): Promise<SchoolStatistics | null> => {
//     try {
//         const res = await fetch(`${getBaseUrl()}/schools/${id}/statistics`);

//         if (!res.ok) {
//             throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
//         }

//         const data = res.json();

//         return data;
//     } catch (e) {
//         console.error("Falha ao buscar equipamentos de escolas:", e);
//         return null;
//     }
// };

export const getSchoolClubs = async (school_id: string): Promise<ClubeCiencia[]> => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/schools/${school_id}/clubs`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return [];
    }
};


export const getSchoolProjects = async (school_id: string) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/schools/${school_id}/projects`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return [];
    }
}


export const getSchoolResearchers = async (school_id: string) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/schools/${school_id}/researchers`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return [];
    }
}


export const getSchoolStatistics = async (school_id: string) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/schools/${school_id}/statistics`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return [];
    }
}


export const createSchool = async (school: SchoolCreate) => {
    try {
        const res = await fetch(`${getBaseUrl()}/schools`, {
            method: "POST",
            body: JSON.stringify(school),
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) {
            throw new Error(
                `Erro ao criar escola: ${res.status} ${res.statusText}`
            );
        }
        const data = await res.json();
        return data;
    } catch (e) {
        console.error("Falha ao criar escola:", e);
        throw e;
    }
};

export const deleteSchool = async (id: string) => {
    try {
        const res = await fetch(`${getBaseUrl()}/schools/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) {
            throw new Error(
                `Erro ao deletar escola: ${res.status} ${res.statusText}`
            );
        }
        return true;
    } catch (e) {
        console.error("Falha ao deletar escola:", e);
        throw e;
    }
};


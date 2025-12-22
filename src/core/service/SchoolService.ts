import { Equipment } from "@/core/interface/Equipment";
import { getBaseUrl } from "@/core/utils/api";
import { School, SchoolCreate, SchoolSearchParams} from "../domain/School";
import { ScienceClub } from "../domain/Club";


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
): Promise<School | null> => {
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

export const getSchools = async (params?: SchoolSearchParams
): Promise<School[]> => {
    try {
        const query = new URLSearchParams();
        if (params?.name) query.append("name", params.name);
        if (params?.city) query.append("city", params.city);
        if (params?.page) query.append("page", params.page.toString());
        const res = await fetch(
            `${getBaseUrl()}/schools/?${query.toString()}`
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
export const getSchoolClubs = async (school_id: string): Promise<ScienceClub[]> => {
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

export const uploadSchoolImage = async (school_id: string, form: FormData) => {
    try {
        const res = await fetch(`${getBaseUrl()}/schools/${school_id}/images`, {
            method: "POST",
            body: form,
            credentials: "include",
        });
        if (!res.ok) {
            throw new Error(`Erro ao enviar imagem: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (e) {
        console.error("Falha ao enviar imagem:", e);
        throw e;
    }
}
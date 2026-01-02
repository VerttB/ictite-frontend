import { Equipment } from "@/core/domain/Equipment";
import {
    School,
    SchoolCreate,
    SchoolSearchParams,
    SchoolStatistics,
} from "../domain/School";
import { ScienceClub } from "../domain/Club";
import { Pagination } from "@/schemas/Pagination";
import { apiClient } from "@/lib/api/client";
import { Project } from "../domain/Project";
import { Researcher } from "../domain/Researcher";

export const getSchoolGeoData = async () => {
    return await apiClient.get<any>("/schools/geojson");
};

export const getSchoolById = async (id: string): Promise<School> => {
    const data = await apiClient.get<School>(`/schools/${id}`);
    if (!data) {
        throw new Error("Escola não encontrada");
    }
    return data;
};

export const getSchools = async (
    params?: SchoolSearchParams
): Promise<Pagination<School>> => {
    console.log(params);
    const data = await apiClient.get<Pagination<School>>("/schools", { params });

    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const getSchoolEquiments = async (id: string): Promise<Equipment[]> => {
    return (await apiClient.get<Equipment[]>(`/schools/${id}/equipments`)) || [];
};

export const getSchoolClubs = async (school_id: string): Promise<ScienceClub[]> => {
    return (await apiClient.get<ScienceClub[]>(`/schools/${school_id}/clubs`)) || [];
};

export const getSchoolProjects = async (school_id: string): Promise<Project[]> => {
    const data = await apiClient.get<Project[]>(`/schools/${school_id}/projects`);
    return data || [];
};

export const getSchoolResearchers = async (school_id: string): Promise<Researcher[]> => {
    const data = await apiClient.get<Researcher[]>(`/schools/${school_id}/researchers`);
    return data || [];
};

export const getSchoolStatistics = async (
    school_id: string
): Promise<SchoolStatistics> => {
    const data = await apiClient.get<SchoolStatistics>(
        `/schools/${school_id}/statistics`
    );
    if (!data) {
        throw new Error("Estatísticas da escola não encontradas");
    }
    return data;
};

export const createSchool = async (school: SchoolCreate): Promise<School> => {
    const data = await apiClient.post<School>("/schools", school);
    if (!data) {
        throw new Error("Erro ao criar escola");
    }
    return data;
};

export const deleteSchool = async (id: string) => {
    await apiClient.delete(`/schools/${id}`);
    return true;
};

export const uploadSchoolImage = async (school_id: string, form: FormData) => {
    return await apiClient.post(`/schools/${school_id}/images`, form);
};

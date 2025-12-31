import { Equipment } from "@/core/domain/Equipment";
import { School, SchoolCreate, SchoolSearchParams } from "../domain/School";
import { ScienceClub } from "../domain/Club";
import { Pagination } from "@/schemas/Pagination";
import { apiClient } from "@/lib/api/client";

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
    const data = await apiClient.get<Pagination<School>>("/schools", { params });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const getSchoolEquiments = async (id: string): Promise<Equipment[]> => {
    return (await apiClient.get<Equipment[]>(`/schools/${id}/equipments`)) || [];
};

export const getSchoolClubs = async (school_id: string): Promise<ScienceClub[]> => {
    return (await apiClient.get<ScienceClub[]>(`/schools/${school_id}/clubs`)) || [];
};

export const getSchoolProjects = async (school_id: string) => {
    const data = await apiClient.get(`/schools/${school_id}/projects`);
    return data || [];
};

export const getSchoolResearchers = async (school_id: string) => {
    const data = await apiClient.get(`/schools/${school_id}/researchers`);
    return data || [];
};

export const getSchoolStatistics = async (school_id: string) => {
    return await apiClient.get(`/schools/${school_id}/statistics`);
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

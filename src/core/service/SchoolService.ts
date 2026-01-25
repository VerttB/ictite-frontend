import { Equipment } from "@/core/domain/Equipment";
import {
    School,
    SchoolCreate,
    SchoolGeoJson,
    SchoolSearchParams,
    SchoolStatistics,
    SchoolUpdate,
} from "../domain/School";
import { ScienceClub } from "../domain/Club";
import { Pagination } from "@/schemas/Pagination";
import { apiClient } from "@/lib/api/client";
import { Project } from "../domain/Project";
import { Researcher } from "../domain/Researcher";

export const getSchoolGeoData = async (): Promise<SchoolGeoJson> => {
    return await apiClient.get<SchoolGeoJson>("/schools/geojson/");
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
    const data = await apiClient.get<Pagination<School>>("/schools/", { params });

    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const getSchoolEquiments = async (id: string): Promise<Equipment[]> => {
    return (await apiClient.get<Equipment[]>(`/schools/${id}/equipments/`)) || [];
};

export const getSchoolClubs = async (school_id: string): Promise<ScienceClub[]> => {
    return (await apiClient.get<ScienceClub[]>(`/schools/${school_id}/clubs/`)) || [];
};

export const getSchoolProjects = async (school_id: string): Promise<Project[]> => {
    const data = await apiClient.get<Project[]>(`/schools/${school_id}/projects/`, {});
    return data || [];
};

export const getSchoolResearchers = async (school_id: string): Promise<Researcher[]> => {
    const data = await apiClient.get<Researcher[]>(`/schools/${school_id}/researchers/`);
    return data || [];
};

export const getSchoolStatistics = async (
    school_id: string
): Promise<SchoolStatistics> => {
    return (
        (await apiClient.get<SchoolStatistics>(`/schools/${school_id}/statistics/`)) || {
            total_clubs: 0,
            total_projects: 0,
            total_researchers: 0,
        }
    );
};

export const createSchool = async (school: SchoolCreate): Promise<School> => {
    return await apiClient.post<School>("/schools/", school);
};

export const deleteSchool = async (id: string): Promise<void> => {
    await apiClient.delete(`/schools/${id}/`);
};

export const updateSchool = async (
    id: string,
    school: Partial<SchoolUpdate>
): Promise<School> => {
    return await apiClient.patch<School>(`/schools/${id}/`, school);
};
export const uploadSchoolImage = async (school_id: string, form: FormData) => {
    return await apiClient.post(`/schools/${school_id}/images/`, form);
};

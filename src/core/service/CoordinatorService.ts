import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";
import { Coordinator } from "../domain/Coordinator";

export const getCoordinators = async (params?: any): Promise<Pagination<Coordinator>> => {
    const data = await apiClient.get<Pagination<Coordinator>>("/coordinators/", {
        params,
    });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const createCoordinator = async (data: any) => {
    return await apiClient.post("/coordinators/", data);
};

export const updateCoordinator = async (id: string, data: any) => {
    return await apiClient.patch(`/coordinators/${id}`, data);
};

export const deleteCoordinator = async (id: string) => {
    return await apiClient.delete(`/coordinators/${id}`);
};

export const getClubProfessors = async (clubId: string): Promise<any[]> => {
    const data = await apiClient.get<any[]>(`/clubes-ciencia/${clubId}/professors`);
    return data || [];
};

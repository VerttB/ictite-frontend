import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";
import { Coordinator, CoordinatorCreate, CoordinatorSimplified, CoordinatorUpdate } from "../domain/Coordinator";
import { SearchParams } from "../interface/SearchParams";

export const getCoordinators = async (params?: SearchParams): Promise<Pagination<Coordinator>> => {
    const data = await apiClient.get<Pagination<Coordinator>>("/coordinators/", {
        params,
    });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const createCoordinator = async (data: CoordinatorCreate): Promise<Coordinator> => {
    return await apiClient.post<Coordinator>("/coordinators/", data);
};

export const updateCoordinator = async (id: string, data: CoordinatorUpdate): Promise<Coordinator> => {
    return await apiClient.patch<Coordinator>(`/coordinators/${id}`, data);
};

export const deleteCoordinator = async (id: string) => {
    return await apiClient.delete(`/coordinators/${id}`);
};

export const getClubProfessors = async (clubId: string): Promise<CoordinatorSimplified[]> => {
    const data = await apiClient.get<CoordinatorSimplified[]>(`/clubes-ciencia/${clubId}/professors`);
    return data || [];
};

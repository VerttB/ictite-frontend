import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";
import { Coordinator } from "../domain/Coordinator";

export const getCoordinators = async (
    params?: any
): Promise<Pagination<Coordinator>> => {
    const data = await apiClient.get<Pagination<Coordinator>>("/coordinators/", { params });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

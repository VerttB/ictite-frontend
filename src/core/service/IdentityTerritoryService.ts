import { apiClient } from "@/lib/api/client";
import {
    IdentityTerritory,
    IdentityTerritoryCreate,
    IdentityTerritoryUpdate,
} from "../domain/IdentityTerritory";

export const getTerritories = async (): Promise<IdentityTerritory[]> => {
    return (await apiClient.get<IdentityTerritory[]>("/identity-territories/")) || [];
};

export const createTerritory = async (
    newTerritory: IdentityTerritoryCreate
): Promise<IdentityTerritory> => {
    return await apiClient.post<IdentityTerritory>(
        "/identity-territories/",
        newTerritory
    );
};

export const deleteTerritory = async (territoryId: string): Promise<void> => {
    await apiClient.delete(`/identity-territories/${territoryId}/`);
};

export const updateTerritory = async (
    territoryId: string,
    updatedData: IdentityTerritoryUpdate
): Promise<IdentityTerritory> => {
    return await apiClient.patch<IdentityTerritory>(
        `/identity-territories/${territoryId}/`,
        updatedData
    );
};

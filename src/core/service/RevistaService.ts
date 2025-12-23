import {
    Magazine,
    MagazineCreate,
    MagazineSearchParams,
} from "../domain/Magazine";
import { getBaseUrl } from "../utils/api";
import { buildSearchParameters } from "../utils/searchParamBuilder";

export const getRevistas = async (
    params?: MagazineSearchParams
): Promise<Required<Magazine>[]> => {
    try {
        const response = await fetch(
            `${getBaseUrl()}/magazine/?${buildSearchParameters(params || {})}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch revistas");
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createRevista = async (newRevista: MagazineCreate) => {
    try {
        const response = await fetch(`${getBaseUrl()}/magazine`, {
            method: "POST",

            body: JSON.stringify(newRevista),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to create material");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const uploadMagazineImage = async (
    magazineId: string,
    formData: FormData
) => {
    try {
        const response = await fetch(
            `${getBaseUrl()}/magazine/${magazineId}/images`,
            {
                method: "POST",
                body: formData,
            }
        );
        if (!response.ok) {
            throw new Error("Failed to upload magazine images");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

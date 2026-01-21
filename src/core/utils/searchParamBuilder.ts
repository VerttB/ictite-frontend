import { SearchParams } from "../interface/SearchParams";

export const buildSearchParameters = (
    filters: SearchParams,
    existingParams?: URLSearchParams
): string => {
    const params = new URLSearchParams(existingParams?.toString() || "");
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach((val) => params.append(key, val.toString()));
            } else {
                params.set(key, value.toString());
            }
        } else {
            params.delete(key);
        }
    });

    return params.toString();
};

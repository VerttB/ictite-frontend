export const buildSearchParameters = (
    filters: Record<string, any>,
    existingParams?: URLSearchParams
): string => {
    const params = new URLSearchParams(existingParams?.toString() || "");
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach((val) => params.append(key, val));
            } else {
                params.append(key, value);
            }
        } else {
            params.delete(key);
        }
    });

    return params.toString();
};

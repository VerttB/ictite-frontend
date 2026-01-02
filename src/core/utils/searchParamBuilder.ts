export const buildSearchParameters = (filters: Record<string, any>): string => {
    const params = new URLSearchParams();
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

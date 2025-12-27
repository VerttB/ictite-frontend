import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export const useUrlPagination = (defaultPage = 1) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || defaultPage;
    const updateUrl = useCallback(
        (newParams: Record<string, any>) => {
            const currentParams = new URLSearchParams(searchParams);
            console.log(searchParams.toString());
            Object.entries(newParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    currentParams.set(key, value);
                } else {
                    currentParams.delete(key);
                }
            });
            router.replace(`${pathname}?${currentParams.toString()}`);
        },
        [pathname, router, searchParams]
    );
    const applyFilters = (filters: Record<string, any>) => {
        updateUrl({ ...filters, page: 1 });
    };
    const changePage = (page: number) => {
        if (page < 1) return;
        updateUrl({ page });
    };

    return { page: currentPage, updateUrl, applyFilters, changePage };
};

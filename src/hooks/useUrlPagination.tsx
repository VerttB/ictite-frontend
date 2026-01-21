import { SearchParams } from "@/core/interface/SearchParams";
import { buildSearchParameters } from "@/core/utils/searchParamBuilder";
import { Route } from "next";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export const useUrlPagination = (defaultPage = 1) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || defaultPage;
    const updateUrl = useCallback(
        (newParams: SearchParams) => {
            const query = buildSearchParameters(newParams);
            router.replace(`${pathname}?${query.toString()}` as Route);
        },
        [pathname, router, searchParams]
    );
    const applyFilters = useCallback(
        (filters: SearchParams) => {
            updateUrl({ ...filters, page: 1 });
        },
        [updateUrl]
    );

    const changePage = useCallback(
        (page: number) => {
            if (page < 1) return;
            updateUrl({ page });
        },
        [updateUrl]
    );
    return { page: currentPage, updateUrl, applyFilters, changePage };
};

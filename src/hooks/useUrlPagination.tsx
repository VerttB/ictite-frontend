import { SearchParams } from "@/core/interface/SearchParams";
import { buildSearchParameters } from "@/core/utils/searchParamBuilder";
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
            router.replace(`${pathname}?${query.toString()}`);
        },
        [pathname, router]
    );
    const applyFilters = (filters: SearchParams) => {
        updateUrl({ ...filters, page: 1 });
    };
    const changePage = (page: number) => {
        if (page < 1) return;
        updateUrl({ page });
    };

    return { page: currentPage, updateUrl, applyFilters, changePage };
};

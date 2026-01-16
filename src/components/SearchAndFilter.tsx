/* eslint-disable */
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { Button } from "./ui/button";
import { ItemFilterConfig } from "@/core/interface/ItemFilterConfig";
import { ListFilter } from "lucide-react";
import { SearchParams } from "@/core/interface/SearchParams";
interface FilterListProps<T> {
    onSearch?: (filters: SearchParams) => void;
    currentParams: SearchParams;
    applyParams: (params: SearchParams) => void;
    mainSearchKey: string;
    mainSearchPlaceholder?: string;
    filters: ItemFilterConfig<T>[];
}

export const SearchAndFilter = <T,>({
    onSearch,
    currentParams,
    applyParams,
    mainSearchKey,
    mainSearchPlaceholder,
    filters,
}: FilterListProps<T>) => {
    const [openModal, setOpenModal] = useState(false);
    const [localFilters, setLocalFilters] = useState<Record<string, any>>({});

    const activeFiltersCount = filters.filter((f) => !!currentParams[f.key]).length;

    const handleMainSearch = (value: string) => {
        const newParams = { ...currentParams };
        if (value) newParams[mainSearchKey] = value;
        else delete newParams[mainSearchKey];
        applyParams(newParams);
    };

    const clearAllFilters = () => {
        const cleared: Record<string, any> = {};
        filters.forEach((f) => (cleared[f.key] = ""));
        setLocalFilters(cleared);
    };
    return (
        <div className="flex items-center">
            <SearchBar
                placeholder={mainSearchPlaceholder}
                initialValue={String(currentParams[mainSearchKey] || "")}
                onSearch={handleMainSearch}
            />
            <Button title="Mais Filtros" onClick={() => setOpenModal(true)}>
                <ListFilter size={32} />
            </Button>
        </div>
    );
};

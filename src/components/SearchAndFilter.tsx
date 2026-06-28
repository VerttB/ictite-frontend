/* eslint-disable */
import { useCallback, useState, useMemo } from "react";
import { SearchBar } from "./SearchBar";
import { Button } from "./ui/button";
import { ItemFilterConfig } from "@/core/interface/ItemFilterConfig";
import { ListFilter } from "lucide-react";
import { SearchParams } from "@/core/interface/SearchParams";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface FilterListProps<T> {
    onSearch?: (filters: SearchParams) => void;
    currentParams: SearchParams;
    applyParams: (params: SearchParams) => void;
    mainSearchKey: string;
    mainSearchPlaceholder?: string;
    filters: ItemFilterConfig<T>[];
    renderFilters?: (props: {
        currentParams: SearchParams;
        applyParams: (params: SearchParams) => void;
        closeFilters: () => void;
    }) => React.ReactNode;
}

export const SearchAndFilter = <T,>({
    onSearch,
    currentParams,
    applyParams,
    mainSearchKey,
    mainSearchPlaceholder,
    filters,
    renderFilters,
}: FilterListProps<T>) => {
    const [openModal, setOpenModal] = useState(false);

    const handleMainSearch = useCallback(
        (value: string) => {
            const newParams = { ...currentParams };
            if (value) newParams[mainSearchKey] = value;
            else delete newParams[mainSearchKey];
            applyParams(newParams);
        },
        [currentParams, mainSearchKey, applyParams]
    );

    const hasActiveFilters = useMemo(() => {
        const ignoreKeys = ["page", "size", mainSearchKey];
        return Object.keys(currentParams).some(
            (key) =>
                !ignoreKeys.includes(key) &&
                currentParams[key] !== undefined &&
                currentParams[key] !== ""
        );
    }, [currentParams, mainSearchKey]);

    return (
        <div className="flex items-center gap-2 w-full justify-end">
            <SearchBar
                placeholder={mainSearchPlaceholder}
                initialValue={currentParams[mainSearchKey]?.toString() || ""}
                onSearch={handleMainSearch}
            />
            {!!renderFilters && (
                <Button
                    variant="outline"
                    title="Mais Filtros"
                    onClick={() => setOpenModal(true)}
                    className="relative h-9 px-3"
                >
                    <ListFilter size={20} className="mr-2" />
                    Filtros
                    {hasActiveFilters && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                    )}
                </Button>
            )}

            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Filtros Avançados</DialogTitle>
                        <DialogDescription>
                            Selecione as opções desejadas para filtrar a listagem.
                        </DialogDescription>
                    </DialogHeader>

                    {renderFilters &&
                        renderFilters({
                            currentParams,
                            applyParams,
                            closeFilters: () => setOpenModal(false),
                        })}
                </DialogContent>
            </Dialog>
        </div>
    );
};

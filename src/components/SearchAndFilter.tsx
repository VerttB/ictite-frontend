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
    DialogTrigger,
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
    currentParams,
    applyParams,
    mainSearchKey,
    mainSearchPlaceholder,
    renderFilters,
}: FilterListProps<T>) => {
    const [openModal, setOpenModal] = useState(false);

    const handleMainSearch = useCallback(
        (value: string) => {
            const newParams = { ...currentParams };
            newParams[mainSearchKey] = value || undefined;
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
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <div className="flex w-full min-w-0 items-center justify-end gap-2">
                <SearchBar
                    key={currentParams[mainSearchKey]?.toString() || ""}
                    placeholder={mainSearchPlaceholder}
                    initialValue={currentParams[mainSearchKey]?.toString() || ""}
                    onSearch={handleMainSearch}
                />
                {!!renderFilters && (
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            title="Mais Filtros"
                            aria-label="Mais filtros"
                            className="relative h-9 px-3">
                            <ListFilter size={20} className="mr-2" />
                            Filtros
                            {hasActiveFilters && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                                </span>
                            )}
                        </Button>
                    </DialogTrigger>
                )}

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
            </div>
        </Dialog>
    );
};

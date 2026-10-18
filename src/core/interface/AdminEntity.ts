import { ZodType } from "zod";
import { FieldValues } from "react-hook-form";
import { Pagination } from "@/schemas/Pagination";
import { SearchParams } from "./SearchParams";

export interface ChildTabConfig {
    id: string;
    label: string;
    entityName: string;
    parentIdField: string;
    renderList: (parentId: string) => React.ReactNode;
}

export interface AdminFormProps {
    parentId?: string;
    parentIdField?: string;
}

export interface AdminEntityConfig<
    T extends { id: string; name: string },
    CreateDTO extends FieldValues,
    UpdateDTO extends FieldValues,
    TCreateSchema extends ZodType,
    TUpdateSchema extends ZodType = TCreateSchema,
> {
    title: string;
    entityName: string;
    schema?: TCreateSchema; // Legacy, kept for compatibility if needed
    createSchema: TCreateSchema;
    updateSchema: TUpdateSchema;
    defaultValues: Partial<CreateDTO>;
    mapToFormValues?: (item: T) => Partial<CreateDTO | UpdateDTO>;
    renderForm: (props: AdminFormProps) => React.ReactNode;
    renderFilters?: (props: {
        currentParams: SearchParams;
        applyParams: (params: SearchParams) => void;
        closeFilters: () => void;
    }) => React.ReactNode;
    renderEditActions?: (item: T) => React.ReactNode;
    childTabs: ChildTabConfig[];

    // API Functions
    fetchFn: (params: FieldValues) => Promise<Pagination<T>>;
    createFn: (data: CreateDTO) => Promise<T & { _redirectToList?: boolean }>;
    updateFn: (id: string, data: UpdateDTO) => Promise<T>;
    deleteFn: (id: string) => Promise<void>;
}

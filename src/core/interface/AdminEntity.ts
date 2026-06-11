import { ZodType } from "zod";
import { FieldValues } from "react-hook-form";

export interface ChildTabConfig {
    id: string;
    label: string;
    entityName: string;
    parentIdField: string;
    renderList: (parentId: string) => React.ReactNode;
}

export interface AdminFormProps {
    methods: any;
    parentId?: string;
    parentIdField?: string;
}

export interface AdminEntityConfig<
    T extends { id: string; name?: string },
    CreateDTO extends FieldValues,
    UpdateDTO extends FieldValues,
    TCreateSchema extends ZodType<any, any, any>,
    TUpdateSchema extends ZodType<any, any, any> = TCreateSchema,
> {
    title: string;
    entityName: string;
    schema?: TCreateSchema; // Legacy, kept for compatibility if needed
    createSchema: TCreateSchema;
    updateSchema: TUpdateSchema;
    defaultValues: Partial<CreateDTO>;
    mapToFormValues?: (item: T) => Partial<CreateDTO | UpdateDTO>;
    renderForm: (props: AdminFormProps) => React.ReactNode;
    childTabs: ChildTabConfig[];

    // API Functions
    fetchFn: (params: any) => Promise<any>;
    createFn: (data: CreateDTO) => Promise<T>;
    updateFn: (id: string, data: UpdateDTO) => Promise<T>;
    deleteFn: (id: string) => Promise<void>;
}

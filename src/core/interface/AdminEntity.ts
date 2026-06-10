import { ZodType } from "zod";
import { UseFormProps, FieldValues } from "react-hook-form";

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
    T extends { id: string },
    CreateDTO extends FieldValues,
    UpdateDTO extends FieldValues,
    TSchema extends ZodType<any, any, any>
> {
    title: string;
    entityName: string;
    schema: TSchema;
    createSchema?: TSchema;
    updateSchema?: TSchema;
    defaultValues: Partial<T | CreateDTO | UpdateDTO>;
    mapToFormValues?: (item: T) => Partial<CreateDTO | UpdateDTO>;
    renderForm: (props: AdminFormProps) => React.ReactNode;
    childTabs?: ChildTabConfig[];
    
    // API Functions
    fetchFn: (params: any) => Promise<any>;
    createFn: (data: CreateDTO) => Promise<T>;
    updateFn: (id: string, data: UpdateDTO) => Promise<T>;
    deleteFn: (id: string) => Promise<void>;
}

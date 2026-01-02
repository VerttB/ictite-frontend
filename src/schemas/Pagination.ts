import z from "zod";
import { SearchParamParser } from "./Common";
export const PaginationSchema = <T extends z.ZodType>(itemSchema: T) => {
    return z.object({
        page: z.number().min(1).default(1),
        size: z.number().min(1).max(100).default(15),
        total_pages: z.number().min(0).default(0),
        items: z.array(itemSchema).default([]),
        total: z.number().min(0).default(0),
    });
};

export type Pagination<T> = z.infer<ReturnType<typeof PaginationSchema<z.ZodType<T>>>>;

export const PaginationSearchParamsSchema = z.object({
    page: SearchParamParser.page,
    size: SearchParamParser.number,
});

export type PaginationSearchParams = z.infer<typeof PaginationSearchParamsSchema>;

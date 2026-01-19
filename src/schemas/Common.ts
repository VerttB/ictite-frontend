import { z } from "zod";

export const SimpleIdNameSchema = z.object({
    id: z.uuid(),
    name: z.string(),
});

export const SimpleIdNameDescriptionSchema = SimpleIdNameSchema.extend({
    description: z.string(),
});
export const SearchParamParser = {
    string: z.string().optional().catch(undefined),
    page: z.coerce.number().min(1).optional().default(1).catch(1),
    number: z.coerce.number().min(0).optional().catch(undefined),
    array: z.preprocess((val) => {
        if (val === undefined || val === null) return undefined;
        if (Array.isArray(val)) return val;
        return [val];
    }, z.array(z.string()).optional().default([])),
};

export type SimpleIdName = z.infer<typeof SimpleIdNameSchema>;

import { z } from "zod";

export const InstagramPostSchema = z.object({
    id: z.string().uuid(), 
    post_id: z.string(),   
    title: z.string().nullable(),
    description: z.string().nullable(),
    post_date: z.coerce.date(),
    type: z.string().nullable(),
    image_url: z.string().url().nullable(),
    post_url: z.string().url(),
    like_count: z.number(),
    comment_count: z.number(),
    owner_id: z.string().nullable(),
    fetched_at: z.coerce.date(), 
});

export type InstagramPost = z.infer<typeof InstagramPostSchema>;

export const InstagramSearchParamsSchema = z.object({
    type: z.string().optional(),
});

export type InstagramSearchParams = z.infer<typeof InstagramSearchParamsSchema>;
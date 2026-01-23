import {z} from "zod";
export const getCoursesSchema = z.object({
    userid: z.number().int().positive(),
    token: z.string().min(1)
})

export const getCoursesPayloadSchema = z.object({
    data: getCoursesSchema
});

export type GetCoursesRequest = z.infer<typeof getCoursesSchema>;
export type GetCoursesPayload = z.infer<typeof getCoursesPayloadSchema>;
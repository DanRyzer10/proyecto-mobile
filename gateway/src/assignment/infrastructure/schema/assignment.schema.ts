import { getCoursesSchema } from "@/course/infrastructure/schema/course.schema";
import {z} from "zod";


export const getAssigmentsSchema = z.object({
    courseids: z.array(z.number().int().positive()).optional(),
    capabilities: z.array(z.number().int().positive()).optional(),
    includenotenrolledcourses: z.boolean().optional(),
})

export const getAssignmentsPayloadSchema = z.object({
    data: getAssigmentsSchema
})

export type GetAssignmentRequest = z.infer<typeof getAssigmentsSchema>;
export type GetAssignmentPayload = z.infer<typeof getAssignmentsPayloadSchema>;
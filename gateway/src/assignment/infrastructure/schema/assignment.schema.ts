import { getCoursesSchema } from "@/course/infrastructure/schema/course.schema";
import { text } from "node:stream/consumers";
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


export const saveSubmissionSchema = z.object({
    assignmentid: z.number().int().positive(),
    plugindata: z.object({
        files_filemanager : z.number().int().positive().optional(),
        onlinetext_editor: z.object({
            text: z.string().optional(),
            format: z.number().int().positive().optional(),
            itemid: z.number().int().positive().optional(),
        }).optional()
    })
})

export const saveSubmissionPayloadSchema = z.object({
    data: saveSubmissionSchema
})

export type SaveSubmissionRequest = z.infer<typeof saveSubmissionSchema>;
export type SaveSubmissionPayload = z.infer<typeof saveSubmissionPayloadSchema>;
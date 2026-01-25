import { Request, Response } from "express";
import { AssignmentService } from "../../application/assignment-service";
import { IAssignmentService } from "@/assignment/domain/assignment-service";
import { getCoursesPayloadSchema } from "@/course/infrastructure/schema/course.schema";
import { getAssignmentsPayloadSchema } from "../schema/assignment.schema";
import { formatZodError } from "@/shared/infrastructure/zod-error-formatter";

export class AssignmentController {
    constructor(private assignmentService: IAssignmentService) { }

    async getAssignments(req: Request, res: Response): Promise<void> {
        try {
            const  user = (req as any).user;
            const body = req.body;
            const userValidation = getCoursesPayloadSchema.safeParse(user);
            const bodyValidation = getAssignmentsPayloadSchema.safeParse(body);
            console.log("User Validation:", userValidation);
            console.log("Body Validation:", bodyValidation);

            if ( !userValidation.success ) {
                res.status(400).json(formatZodError(userValidation.error));
                return;
            }

            if ( !bodyValidation.success ) {
                res.status(400).json(formatZodError(bodyValidation.error));
                return;
            }
            const assignments = await this.assignmentService.getAssignments(
                user.data.token,
                body.data.courseids,
                body.data.capabilities,
                body.data.includenotenrolledcourses
            );
            res.json(assignments);
        } catch (error) {
            console.log("Error fetching assignments:", error);
            res.status(500).json({ error: "Failed to fetch assignments" });
        }
    }
}

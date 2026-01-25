import { Request, Response } from "express";
import { CourseService } from "../../application/course-service";
import { getCoursesPayloadSchema } from "../schema/course.schema";
import { ICourseService } from "@/course/domain/course-service";
import { formatZodError } from "@/shared/infrastructure/zod-error-formatter";

export class CourseController {
    constructor(private courseService: ICourseService) { }

    async getAllCourses(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            const validation = getCoursesPayloadSchema.safeParse(user);
            if ( !validation.success ) {
                res.status(400).json(formatZodError(validation.error));
                return;
            }
            const userId = validation.data.data.userid;
            const wsToken = validation.data.data.token;
            const courses = await this.courseService.getCoursesByUserId(userId, wsToken);
            res.json(courses);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    }
}

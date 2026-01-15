import { Request, Response } from "express";
import { CourseService } from "../../application/course-service";

export class CourseController {
    constructor(private courseService: CourseService) { }

    async getAllCourses(req: Request, res: Response): Promise<void> {
        try {
            const courses = await this.courseService.getCourses();
            res.json(courses);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    }
}

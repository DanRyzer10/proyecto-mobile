import { HttpService } from "@/shared/application/http.service";
import { Logger } from "@/shared/infrastructure/logger";
import { Course } from "../domain/course";

export class CourseService {
    constructor(private httpService: HttpService, private logger: Logger) { }

    async getCourses(): Promise<Course[]> {
        try {
            this.logger.info("Fetching courses from Moodle");
            const response = await this.httpService.getRequest("get_courses", {});

            if (!Array.isArray(response)) {
                this.logger.error("Invalid response format from Moodle");
                throw new Error("Invalid response format");
            }

            return response.map((course: any) => ({
                id: course.id,
                fullname: course.fullname,
                shortname: course.shortname,
                summary: course.summary
            }));
        } catch (error) {
            this.logger.error(`Error fetching courses: ${error}`);
            throw error;
        }
    }
}

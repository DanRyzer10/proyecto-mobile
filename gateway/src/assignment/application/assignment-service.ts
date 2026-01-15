import { HttpService } from "@/shared/application/http.service";
import { Logger } from "@/shared/infrastructure/logger";
import { Assignment } from "../domain/assignment";

export class AssignmentService {
    constructor(private httpService: HttpService, private logger: Logger) { }

    async getAssignments(): Promise<Assignment[]> {
        try {
            this.logger.info("Fetching assignments from Moodle");
            const response = await this.httpService.getRequest("get_assignments", {});

            // Moodle mod_assign_get_assignments returns { courses: [ { assignments: [] } ] }
            if (!response.courses || !Array.isArray(response.courses)) {
                this.logger.error("Invalid response format from Moodle");
                throw new Error("Invalid response format");
            }

            const assignments: Assignment[] = [];

            response.courses.forEach((course: any) => {
                if (course.assignments && Array.isArray(course.assignments)) {
                    course.assignments.forEach((assignment: any) => {
                        assignments.push({
                            id: assignment.id,
                            cmid: assignment.cmid,
                            name: assignment.name,
                            duedate: assignment.duedate,
                            course: assignment.course
                        });
                    });
                }
            });

            return assignments;
        } catch (error) {
            this.logger.error(`Error fetching assignments: ${error}`);
            throw error;
        }
    }
}

import { HttpService } from "@/shared/application/http.service";
import { Logger } from "@/shared/infrastructure/logger";
import { Assignment } from "../domain/assignment";
import { IAssignmentService } from "../domain/assignment-service";

export class AssignmentService implements IAssignmentService {
    constructor(private httpService: HttpService, private logger: Logger) { }

    async getAssignments(wsToken: string, courseids?: number[], capabilities?: string[], includenotenrolledcourses?: boolean): Promise<any> {
        try {
            console.log("cursos id como llega", courseids);
            const params: Record<string, any> = { wstoken: wsToken };

            if (courseids !== undefined && courseids !== null) {
                params.courseids = courseids;
            }
            if (capabilities !== undefined && capabilities !== null) {
                params.capabilities = capabilities;
            }
            if (includenotenrolledcourses !== undefined && includenotenrolledcourses !== null) {
                params.includenotenrolledcourses = includenotenrolledcourses;
            }
            return await this.httpService.getRequest("get_assignments",params,true);
        }catch( error) {
            this.logger.error(`Error fetching assignments: ${error}`);
            throw error;
        }
    }

    // async getAssignments(): Promise<Assignment[]> {
    //     try {
    //         this.logger.info("Fetching assignments from Moodle");
    //         const response = await this.httpService.getRequest("get_assignments", {});
    //         if (!response.courses || !Array.isArray(response.courses)) {
    //             this.logger.error("Invalid response format from Moodle");
    //             throw new Error("Invalid response format");
    //         }

    //         const assignments: Assignment[] = [];

    //         response.courses.forEach((course: any) => {
    //             if (course.assignments && Array.isArray(course.assignments)) {
    //                 course.assignments.forEach((assignment: any) => {
    //                     assignments.push({
    //                         id: assignment.id,
    //                         cmid: assignment.cmid,
    //                         name: assignment.name,
    //                         duedate: assignment.duedate,
    //                         course: assignment.course
    //                     });
    //                 });
    //             }
    //         });

    //         return assignments;
    //     } catch (error) {
    //         this.logger.error(`Error fetching assignments: ${error}`);
    //         throw error;
    //     }
    // }
}

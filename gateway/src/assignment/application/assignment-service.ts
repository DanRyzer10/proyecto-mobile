import { HttpService } from "@/shared/application/http.service";
import { Logger } from "@/shared/infrastructure/logger";
import { Assignment } from "../domain/assignment";
import { IAssignmentService } from "../domain/assignment-service";
import { SaveSubmissionRequest } from "../infrastructure/schema/assignment.schema";

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
    async saveSubmission(wsToken: string, submissionData: SaveSubmissionRequest): Promise<any> {
        try {
            const params: Record<string, any> = { wstoken: wsToken, ...submissionData };

        }catch(error) {
            this.logger.error(`Error saving submission: ${error}`);
            throw error;
        }
    }
}

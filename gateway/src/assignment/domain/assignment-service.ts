import { SaveSubmissionRequest } from "../infrastructure/schema/assignment.schema";

export interface IAssignmentService {
    getAssignments(wsToken: string,courseids?: number[], capabilities?: string[], includenotenrolledcourses?: boolean): Promise<any>;

    saveSubmission(wsToken:string,submissionData: SaveSubmissionRequest): Promise<any>;
}
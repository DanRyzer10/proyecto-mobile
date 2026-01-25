export interface IAssignmentService {
    getAssignments(wsToken: string,courseids?: number[], capabilities?: string[], includenotenrolledcourses?: boolean): Promise<any>;
}
import { Request, Response } from "express";
import { AssignmentService } from "../../application/assignment-service";

export class AssignmentController {
    constructor(private assignmentService: AssignmentService) { }

    async getAssignments(req: Request, res: Response): Promise<void> {
        try {
            const assignments = await this.assignmentService.getAssignments();
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch assignments" });
        }
    }
}

import { Router } from "express";
import { AppContext } from "../app-context";
import { authMiddleware } from "@/auth/infrastructure/middlewares/auth-middleware";

const router = Router();
const assignmentController = AppContext.getAssignmentControllerInstance();

/**
 * @swagger
 * /api/v1/assignment:
 *   post:
 *     summary: Get assignments
 *     description: Retrieves a list of assignments.
 *     tags:
 *       - Assignment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.post('/assignment', authMiddleware, (req, res) => {
    assignmentController.getAssignments(req, res);
});

export default router;

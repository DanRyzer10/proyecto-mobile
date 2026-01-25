import { Router } from "express";
import { AppContext } from "../app-context";
import { authMiddleware } from "@/auth/infrastructure/middlewares/auth-middleware";

const router = Router();
const courseController = AppContext.getCourseControllerInstance();

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieves a list of all available courses.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
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
 *                   description:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/courses', authMiddleware, (req, res) => {
    courseController.getAllCourses(req, res);
});

export default router;

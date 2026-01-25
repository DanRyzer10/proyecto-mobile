import { Router } from "express";
import { AppContext } from "../app-context";

const router = Router();
const userController = AppContext.getUserControllerInstance();

/**
 * @swagger
 * /api/v1/user/info:
 *   get:
 *     summary: Get user info
 *     description: Retrieves information about the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/user/info', (req, res) => {
    userController.getUserInfo(req, res);
});

/**
 * @swagger
 * /api/v1/user/create:
 *   post:
 *     summary: Create user
 *     description: Creates a new user. The request body must wrap user fields inside a "data" object.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: object
 *                 required:
 *                   - email
 *                   - password
 *                   - name
 *                   - role
 *                   - username
 *                   - firstname
 *                   - lastname
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: user@example.com
 *                   password:
 *                     type: string
 *                     format: password
 *                     example: Roberto12
 *                   name:
 *                     type: string
 *                     example: string
 *                   role:
 *                     type: string
 *                     example: string
 *                   username:
 *                     type: string
 *                     example: recorder
 *                   firstname:
 *                     type: string
 *                     example: string
 *                   lastname:
 *                     type: string
 *                     example: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/user/create', (req, res) => {
    userController.createUser(req, res);
});

export default router;

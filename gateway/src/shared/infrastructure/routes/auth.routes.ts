import { Router } from "express";
import { AppContext } from "../app-context";

const router = Router();
const authController = AppContext.getAuthControllerInstance();

/**
 * @swagger
 * /api/v1/oauth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticates a user using email and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/oauth/login', (req, res) => {
    authController.signIn(req, res);
});

/**
 * @swagger
 * /api/v1/oauth/google:
 *   get:
 *     summary: Initiate Google OAuth
 *     description: Redirects the user to Google for authentication.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects to Google login
 */
router.get('/oauth/google', (req, res) => {
    authController.signIn(req, res);
});

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth Callback
 *     description: Handles the callback from Google after authentication.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code from Google
 *     responses:
 *       200:
 *         description: Successful authentication
 *       400:
 *         description: Bad request
 */
router.get('/auth/google/callback', (req, res) => {
    authController.oauthCallback(req, res);
});

router.post('/auth/login', (req,res) => {
    authController.login(req,res);
})

export default router;

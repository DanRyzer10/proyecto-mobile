import express from 'express';
import { AppContext } from './shared/infrastructure/app-context';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();
app.use(express.json())


app.use('/public', express.static(path.join(__dirname, '../public')))

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authController = AppContext.getAuthControllerInstance()
const userController = AppContext.getUserControllerInstance();

const courseController = AppContext.getCourseControllerInstance();
const assignmentController = AppContext.getAssignmentControllerInstance();
const moodleProxyController = AppContext.getMoodleProxyControllerInstance();
/**
 * @swagger
 * /oauth/login:
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
app.post('/oauth/login', (req, res) => {
    authController.signIn(req, res);
})

/**
 * @swagger
 * /oauth/google:
 *   get:
 *     summary: Initiate Google OAuth
 *     description: Redirects the user to Google for authentication.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects to Google login
 */
app.get('/oauth/google', (req, res) => {
    authController.signIn(req, res);
})

/**
 * @swagger
 * /auth/google/callback:
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
app.get('/auth/google/callback', (req, res) => {
    authController.oauthCallback(req, res)
})

/**
 * @swagger
 * /user/info:
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
app.get('/user/info', (req, res) => {
    userController.getUserInfo(req, res);
})

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create user
 *     description: Creates a new user.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
app.post('/user/create', (req, res) => {
    userController.createUser(req, res);
})

/**
 * @swagger
 * /course:
 *   get:
 *     summary: Get all courses
 *     description: Retrieves a list of all available courses.
 *     tags:
 *       - Course
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
 */
app.get('/course', (req, res) => {
    courseController.getAllCourses(req, res);
});

/**
 * @swagger
 * /assignment:
 *   get:
 *     summary: Get assignments
 *     description: Retrieves a list of assignments.
 *     tags:
 *       - Assignment
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
 */
app.get('/assignment', (req, res) => {
    assignmentController.getAssignments(req, res);
});

app.get('/health', (req, res) => {
    res.send('OK');
})

// Proxy endpoints for Moodle Mobile App
/**
 * @swagger
 * /login/token.php:
 *   post:
 *     summary: Proxy to Moodle Login Token
 *     description: Proxies the request to Moodle's login/token.php endpoint.
 *     tags:
 *       - Moodle Proxy
 *     responses:
 *       200:
 *         description: Moodle token response
 */
app.all('/login/token.php', (req, res) => {
    moodleProxyController.proxyRequest(req, res);
});

/**
 * @swagger
 * /admin/tool/mobile/launch.php:
 *   post:
 *     summary: Proxy to Moodle Mobile Launch
 *     description: Proxies the request to Moodle's mobile launch endpoint.
 *     tags:
 *       - Moodle Proxy
 *     responses:
 *       200:
 *         description: Moodle launch response
 */
app.all('/admin/tool/mobile/launch.php', (req, res) => {
    moodleProxyController.proxyRequest(req, res);
});

const PORT = process.env.PORT || 8080;

const banner = `
====================================
||        Moodle Gateway          ||
====================================
`;
app.listen(PORT, () => {
    console.log(banner);
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
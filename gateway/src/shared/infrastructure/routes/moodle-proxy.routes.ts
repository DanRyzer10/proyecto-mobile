import { Router } from "express";
import { AppContext } from "../app-context";

const router = Router();
const moodleProxyController = AppContext.getMoodleProxyControllerInstance();

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
router.all('/login/token.php', (req, res) => {
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
router.all('/admin/tool/mobile/launch.php', (req, res) => {
    moodleProxyController.proxyRequest(req, res);
});

export default router;

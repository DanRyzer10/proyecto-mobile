import { Request, Response } from "express";
import { MOODLE_URL } from "@/constants";
import axios from "axios";
import { Logger } from "@/shared/infrastructure/logger";

export class MoodleProxyController {
    constructor(private logger: Logger) { }

    async proxyRequest(req: Request, res: Response): Promise<void> {
        const targetUrl = `${MOODLE_URL}${req.path}`;
        this.logger.info(`Proxying request to: ${targetUrl}`);

        try {
            // Forward the request to Moodle
            // We strip the host header to avoid issues with virtual hosts on the target
            const headers = { ...req.headers };
            delete headers.host;

            const response = await axios({
                method: req.method,
                url: targetUrl,
                headers: headers,
                data: req.body,
                params: req.query,
                responseType: 'stream' // Important for piping binary data if any, and general robustness
            });

            // Set status and headers from Moodle response
            res.status(response.status);
            Object.entries(response.headers).forEach(([key, value]) => {
                res.setHeader(key, value as string | string[]);
            });

            // Pipe the response data back to the client
            response.data.pipe(res);

        } catch (error: any) {
            this.logger.error(`Proxy error: ${error.message}`);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                res.status(error.response.status);
                Object.entries(error.response.headers).forEach(([key, value]) => {
                    res.setHeader(key, value as string | string[]);
                });
                error.response.data.pipe(res);
            } else {
                res.status(500).send('Proxy Error');
            }
        }
    }
}

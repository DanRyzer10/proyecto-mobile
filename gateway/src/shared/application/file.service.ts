import { MOODLE_FILE_URL } from "@/constants";
import { Logger } from "../infrastructure/logger";
import { fileDefaultParams } from "../infrastructure/function-map";
import Busboy from "busboy";
import { Request, Response } from "express";
import { PassThrough } from "node:stream";
import { HttpService } from "./http.service";

export class FileService {
    private baseUrl: string;
    constructor(private logger: Logger, private httpService: HttpService) {
        this.baseUrl = MOODLE_FILE_URL;
    }

    async uploadFile(req: Request, res: Response): Promise<void> {
        const busBoy = Busboy({ headers: req.headers });
        const fields: Record<string, string> = {};

        fields["token"] = (req as any).user.data.token;
        Object.entries(fileDefaultParams).forEach(([key, value]) => {
            fields[key] = value as string;
        });

        let fileProcessed = false;

        busBoy.on("field", (name, val) => {
            fields[name] = val;
        });

        busBoy.on("file", (_fieldname, fileStream, info) => {
            fileProcessed = true;
            const { filename, mimeType } = info;
            const passThrough = new PassThrough();
            fileStream.pipe(passThrough);

            const fileObject = {
                value: passThrough,
                metadata: {
                    filename: filename,
                    contentType: mimeType,
                }
            };

            this.logger.info(`Processing file upload: ${filename}`);

            this.httpService.postRequest(this.baseUrl, fields, fileObject)
                .then((data) => {
                    this.logger.info(`File uploaded successfully`);
                    res.json(data);
                })
                .catch((err) => {
                    this.logger.error(`File upload error: ${err.message}`);
                    if (!res.headersSent) {
                        res.status(500).json({ error: "File upload failed", details: err.message });
                    }
                });
        });

        busBoy.on("finish", () => {
            if (!fileProcessed) {
                this.logger.error("No file was provided in the request");
                res.status(400).json({ error: "No file provided" });
            }
        });

        busBoy.on("error", (err: any) => {
            this.logger.error(`Busboy error: ${err.message}`);
            if (!res.headersSent) {
                res.status(500).json({ error: "Busboy processing failed" });
            }
        });

        req.pipe(busBoy);
    }
}
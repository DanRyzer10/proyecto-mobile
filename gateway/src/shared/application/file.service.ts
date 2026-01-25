
import { MOODLE_FILE_URL } from "@/constants";
import { Logger } from "../infrastructure/logger";
import { fileDefaultParams } from "../infrastructure/function-map";
import FormData from "form-data";
import Busboy from "busboy";
import { Request, Response } from "express";
import { url } from "node:inspector";
import busboy from "busboy";
import { record } from "zod";

export class FileService {
    private baseUrl: string;
    constructor(private logger:Logger){
        this.baseUrl = MOODLE_FILE_URL;
    }

    async uploadFile(req:Request,res:Response):Promise<void> {
        const url = new URL(this.baseUrl);
        const busBoy = Busboy({headers:req.headers});
        const fields:Record<string,string> = {}
        console.log("Busboy initialized");
        busBoy.on("field",(name,val)=> {
            fields[name] = val;
        })
        busBoy.on("file", async(field, file, info) => {
            console.log("File received:", info);
            const {filename,mimeType} = info;
            const form = new FormData();
            form.append("file", file,{
                filename,
                contentType: mimeType
            })
            fileDefaultParams['wstoken'] = (req as any).user.data.token;
            Object.entries(fileDefaultParams).forEach(([key,value])=>{
                form.append(key, value as string);
            })
            Object.entries(fields).forEach(([key,value])=>{
                form.append(key, value);
            });
            this.logger.info(`Uploading file to ${this.baseUrl}`);
            const response = await fetch(url.toString(), {
                method: 'POST',
                body: form as unknown as BodyInit,
                headers: form.getHeaders()
            });
            if(!response.ok){
                this.logger.error(`File upload failed with status ${response.status}`);
                res.status(response.status).json({ error: `File upload failed with status ${response.status}` });
                return;
            }
            const responseData = await response.json();
            res.json(responseData);
        })
        busBoy.on("error",(err :any)=>{
            this.logger.error(`Busboy error: ${err.message}`);
            res.status(500).json({ error: "Internal Server Error" });
        })
        busBoy.on("finish",()=> {
            console.log("Busboy finished processing");
        })

        req.pipe(busBoy);

    }

}
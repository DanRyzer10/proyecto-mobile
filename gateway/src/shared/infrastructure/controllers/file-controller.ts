import { Request,Response } from "express";
import { FileService } from "@/shared/application/file.service";


export class FileController {
    constructor(private fileService:FileService){}

    async uploadFile(req:Request,res:Response):Promise<void> {
        try {
            await this.fileService.uploadFile(req,res);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

import { Auth } from "@/auth/domain/Auth";
import { Request, Response } from "express";

export class AuthController {
    constructor(private authService: Auth){}



    async signIn(req:Request, res:Response): Promise<void> {
        const redirect_url = await this.authService.sigIn(req.body)
        res.redirect(redirect_url.url);
    }
}
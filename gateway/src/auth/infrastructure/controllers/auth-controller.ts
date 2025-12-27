
import { Auth } from "@/auth/domain/Auth";
import { Request, Response } from "express";

export class AuthController {
    constructor(private authService: Auth){}
    async signIn(req:Request, res:Response): Promise<void> {
        const redirect_url = await this.authService.sigIn(req.body)
        res.redirect(redirect_url.url);
    }
    async oauthCallback(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.authService.oauthHandler(req as any);
            res.send(`<p>Hello world</p>`);
        } catch (ex: any) {
            res.status(500).send(`OAuth callback error: ${ex?.message || String(ex)}`);
        }
    }
}
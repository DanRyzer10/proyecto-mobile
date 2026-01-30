
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
            const  redirectUrl = 'moodlecloneapp://auth/callback';
            const result = await this.authService.oauthHandler(req as any);
            console.log('Respuesta final xd', result);
            if(!redirectUrl.includes('moodlecloneapp://')) {
                res.status(400).send('Invalid redirect URI');
                return;
            }
            const url = new URL(redirectUrl);
            url.searchParams.append('token', result.token);
            url.searchParams.append('firstname', result.firstname);
            url.searchParams.append('lastname', result.lastname);
            url.searchParams.append('email', result.email);
            url.searchParams.append('picture', result.picture);
            res.redirect(url.toString());
            // res.json(result);
        } catch (ex: any) {
            res.status(500).send(`OAuth callback error: ${ex?.message || String(ex)}`);
        }
    }
}
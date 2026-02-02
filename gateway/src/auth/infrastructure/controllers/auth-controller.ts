
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
            const finalUrl = url.toString();                                                                                                                                                                                                                                                                                                                                                                       
            res.send(`                                                                                                                                          
                <!DOCTYPE html>                                                                                                                                   
                <html>                                                                                                                                            
                <head>                                                                                                                                          
                    <meta charset="utf-8">                                                                                                                        
                    <title>Redireccionando</title>                                                                                                                 
                </head>                                                                                                                                         
                <body>                                                                                                                                          
                    <p>Redirecting to app...</p>                                                                                                                  
                    <script>                                                                                                                                      
                    window.location.href = "${finalUrl}";                                                                                                       
                    </script>                                                                                                                                     
                </body>                                                                                                                                         
                </html>                                                                                                                                           
            `);
        } catch (ex: any) {
            res.status(500).send(`OAuth callback error: ${ex?.message || String(ex)}`);
        }
    }
    async login(req:Request,res:Response): Promise<void> {
        try {
            const {username, password} = req.body;
            if (!username || !password) {
                res.status(400).json({error: 'Username and password are required'});
                return;
            }
            const result = await this.authService.login(username, password);
            res.json(result);
        } catch (ex: any) {
            res.status(500).send(`Login error: ${ex?.message || String(ex)}`);
        }
    }
}
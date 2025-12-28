import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLOUD_API, GOOGLE_CLOUD_TOKEN_URL, GOOGLE_OAUTH_URL, GOOGLE_REDIRECT_URI } from "@/constants";
import { Auth } from "../domain/Auth";
import { Request } from "express";
import { Logger } from "@/shared/infrastructure/logger";
import axios from "axios";


export class AuthService implements Auth {
    constructor(private logger: Logger){}
    sigIn(data: any): Promise<any> {

        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'consent'
        });
        return Promise.resolve({ url: `${GOOGLE_OAUTH_URL}?${params.toString()}` });
        
    }
    signUp(data: any): Promise<any> {
        return Promise.resolve({});
        
    }
    async oauthHandler(req: Request): Promise<any> {
        const {code} = req.query;
        if ( !code ) {
            return Promise.reject(new Error('Code not provided'));
        }
        try {
            const response = await fetch(`${GOOGLE_CLOUD_TOKEN_URL}/token`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code: code as string,
                    client_id: GOOGLE_CLIENT_ID,
                    client_secret:GOOGLE_CLIENT_SECRET,
                    redirect_uri: GOOGLE_REDIRECT_URI,
                    grant_type: 'authorization_code'
                }).toString()
            })
            console.log('Token data:',response);
            const  data = await response.json();
            const {access_token,id_token} = data;
            console.log('Access Token:', access_token);
            /**
             * peticion datos de usuario
             */
            const userInfoResponse = await fetch(`${GOOGLE_CLOUD_API}/oauth2/v2/userinfo`,{
                headers: {Authorization: `Bearer ${access_token}`}
            });
            const userInfo = await userInfoResponse.json();
            console.log('User Info:', userInfo);
            return { tokens: data, user: userInfo };
        } catch(ex) {
            this.logger.error('OAuth handler error', ex);
            return Promise.reject(ex);
        }
        
    }
}
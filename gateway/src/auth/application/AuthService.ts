import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLOUD_API, GOOGLE_OAUTH_URL, GOOGLE_REDIRECT_URI } from "@/constants";
import { Auth } from "../domain/Auth";
import { Request } from "express";

export class AuthService implements Auth {
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
    oauthHandler(req: Request): Promise<any> {
        const {code} = req.query;
        if ( !code ) {
            return Promise.reject(new Error('Code not provided'));
        }
        try {
            const tokenResponse = await fetch(`${GOOGLE_CLOUD_API}/token`,{
              body: new URLSearchParams({
                code: code as string,
                client_id: GOOGLE_CLIENT_ID,
                client_secret:GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code'
              }) 
            });
            const data = await tokenResponse.json()
            const {access_token,id_token} = data;

            const userInfoResponse = await fetch(`${GOOGLE_CLOUD_API}/oauth2/v2/userinfo`, {
                headers: {Authorization: `Bearer ${access_token}`}
            });
            const userResponse = await userInfoResponse.json();
        }
        
    }
}
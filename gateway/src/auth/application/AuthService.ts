import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLOUD_API, GOOGLE_CLOUD_TOKEN_URL, GOOGLE_OAUTH_URL, GOOGLE_REDIRECT_URI } from "@/constants";
import { Auth } from "../domain/Auth";
import { Request } from "express";
import { Logger } from "@/shared/infrastructure/logger";
import { TokenValidator } from "../infrastructure/helper/validate-token";
import { IUserService } from "@/user/domain/user-service";
import { TokenResolver } from "../infrastructure/helper/token-resolver";



export class AuthService implements Auth {
    constructor(private logger: Logger,
        private tokenValidator: TokenValidator,
        private userService:IUserService,
        private tokenResolver:TokenResolver
    ){}
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
            const user = await this.tokenValidator.validateToken(id_token);
            console.log('Validated User:', user);
            const moodleResponse =  await this.userService.loginUser(user.email,user.googleId,user.firstname,user.lastname);
            console.log('Moodle Response:', moodleResponse);
            const jwtToken = this.tokenResolver.encodeToken({userid:moodleResponse.userId,token:moodleResponse.moodleToken});
            const apiResponse = {
                token: jwtToken,
                firstname : user.firstname,
                lastname: user.lastname,
                email:user.email,
                picture: user.picture
            }
            return apiResponse;
        } catch(ex) {
            this.logger.error('OAuth handler error', ex);
            return Promise.reject(ex);
        }
        
    }
    async login(username: string, password: string): Promise<any> {
        try {
            const moodleResponse = await this.userService.loginUserWithPassword(username, password);
            const jwtToken = this.tokenResolver.encodeToken({userid:1,token:moodleResponse});
            return {
                token: jwtToken,
                firstname: 'admin',
                lastname: 'admin',
                email: username,
                picture: ''
            }

        }catch (ex) {
            this.logger.error('Login error', ex);
            return Promise.reject(ex);
        }
    }
}
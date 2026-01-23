import { GOOGLE_CLIENT_ID } from '@/constants';
import {OAuth2Client} from 'google-auth-library'


export class TokenValidator {
    private client: OAuth2Client;


    constructor(){
        this.client = new OAuth2Client(GOOGLE_CLIENT_ID);
    }

    validateToken = async (token:string) => {
       try {
         const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload();
        return {
            email: payload?.email || '',
            name: payload?.name || '',
            picture: payload?.picture || '',
            googleId: payload?.sub || '',
            firstname: payload?.given_name || '',
            lastname: payload?.family_name || ''
        }
       } catch (e) {
        throw new Error('Invalid ID token');
       }
    }
}
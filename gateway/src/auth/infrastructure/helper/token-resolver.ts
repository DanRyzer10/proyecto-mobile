import { AuthPayload } from '@/auth/domain/auth-object';
import { JWT_SECRET } from '@/constants';
import jwt from 'jsonwebtoken';

export class TokenResolver {
    private jwtSecret: string;

    constructor(){
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        this.jwtSecret = JWT_SECRET;
    }
    encodeToken(payload: AuthPayload,expiresIn:any = '24h'): string {
        return jwt.sign(payload, this.jwtSecret, { expiresIn });
    }
    decodeToken(token:string): AuthPayload {
        try {
            return jwt.verify(token, this.jwtSecret) as AuthPayload;
        } catch (e) {
            throw new Error('Invalid JWT token');
        }
    }
}
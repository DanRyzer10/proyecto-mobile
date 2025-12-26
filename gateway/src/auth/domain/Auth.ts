import { Request } from "express";

export interface Auth {
    sigIn(data:any): Promise<any>;
    signUp(data:any): Promise<any>;
    oauthHandler(request: Request): Promise<any>;
}
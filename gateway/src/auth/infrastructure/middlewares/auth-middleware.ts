import { Request,Response,NextFunction } from "express";
import { auth } from "google-auth-library";
import jwt from "jsonwebtoken";
import { TokenResolver } from "../helper/token-resolver";

export const authMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const veryfyToken = new TokenResolver();
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({
            error: 'Error de autenticación',
            message: 'No se proporcionó el token de autenticación',
            codigo: 'AUTH_NO_TOKEN'
        });
       
    }
     const token = authHeader?.split(' ')[1];
        try {
            const payload = veryfyToken.decodeToken(token!);
            (req as any).user = {
                data: payload
            };
            next();
        }catch(ex){
            return  res.status(401).json({
                error: 'Error de autenticación',
                message: 'Token inválido o expirado',
                codigo: 'AUTH_INVALID_TOKEN'
            });
        }
}

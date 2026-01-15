import { HttpService } from "@/shared/application/http.service";
import { UserService } from "@/user/application/userService";
import { Request, Response } from "express";
import { createUserPayloadSchema } from "../dtos/user.schema";

export class UserController {
    constructor(private httpService:HttpService, private userService:UserService){}


    async getUserInfo(req:Request,res:Response): Promise<any> {
        try {
            const functionKey = 'get_site_info';
            const params = {};
            const response = await this.httpService.getRequest(functionKey,params);
            return res.json(response);

        }catch(ex){
            return res.status(500).json({error: 'Error fetching user info', details: ex});
        }
    }
    
    async createUser(req:Request,res:Response): Promise<any> {
        try {
            const validation = createUserPayloadSchema.safeParse(req.body);
            if(!validation.success) {
                return res.status(400).json({error: 'Invalid user data', details: validation.error});
            }
            const response = await this.userService.createUser(validation.data.data);
            return res.json(response);

        }catch(ex) {
            return res.status(500).json({error: 'Error creating user', details: ex});
        }
    }
}
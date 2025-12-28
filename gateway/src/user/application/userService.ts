import { HttpService } from "@/shared/application/http.service";
import { CreateMoodleUserInput } from "../domain/create-user";
import { IUserService } from "../domain/user-service";
import { Logger } from "@/shared/infrastructure/logger";
import { userInfo } from "node:os";
import { array } from "zod";



export class UserService implements IUserService {
    constructor(private httpService:HttpService,private log:Logger){}
    async createUser(data: any[]): Promise<any> {
        const arrayResponse: object[] = []; 
        const usernames: string[] = data.map(u => u.username)
        const response:any[] = await this.getUserByField('username',usernames);
        if(response && response.length > 0){
            response.forEach(existingUser => {
                arrayResponse.push({
                    username: existingUser.username,
                    fechaTransaccion: existingUser.fechaTransaccion,
                    codigoError:'101',
                    mensajeError:'El usuario ya existe'
                })
            })
        }
        const usersToCreate = data.filter(u => !arrayResponse.find(r => (r as any).username === u.username));
        if(usersToCreate.length === 0){
            return Promise.resolve({users: arrayResponse});
        }
        const functionKey = 'create_users';
        const params: Record<string, any> = {};
        data.forEach((user,index) => {
            Object.entries(user).forEach(([key,value]) => {
                params[`users[${index}][${key}]`] = value;
            })
        })
        this.log.info(`Creating users with params: ${JSON.stringify(params)}`);
        const moodleResponse = await this.httpService.getRequest(functionKey,usersToCreate);
        moodleResponse.forEach((createdUser: any) => {
            arrayResponse.push({
                username: createdUser.username,
                id: createdUser.id,
                fechaTransaccion: new Date().toISOString(),
                codigoError:'0',
                mensajeError:'Usuario creado exitosamente'
            })
        });
        return {users: arrayResponse};
    }
    updateUser(id: number, data: Partial<CreateMoodleUserInput>): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getUser(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteUser(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async getUserByField(field: string, value: string | string[]): Promise<any> {
        const params: Record<string, any> = {};
        if(Array.isArray(value)) {
            value.forEach((val,index)=>{
                params[`values[${index}]`] = val;
            })
        } else {
            params['values[0]'] = value;
        }
        params['field'] = field;
        const functionKey = 'get_user_by_field';
        this.log.info(`Getting user by field with params: ${JSON.stringify(params)}`);
        return this.httpService.getRequest(functionKey,params);
    }
}
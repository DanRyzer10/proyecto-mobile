import { CreateMoodleUserInput } from "./create-user";

export interface IUserService {
    createUser(data: CreateMoodleUserInput): Promise<any>;
    updateUser(id: number, data: Partial<CreateMoodleUserInput>): Promise<any>;
    getUser(id: number): Promise<any>;
    deleteUser(id: number): Promise<any>;
    getUserByField(field:string,value:string | string[]):Promise<any>;
    loginUser(email:string,google_id:string,firstname:string,lastname:string):Promise<any>;
    loginUserWithPassword(email:string,password:string):Promise<any>;
}
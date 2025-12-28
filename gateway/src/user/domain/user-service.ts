import { CreateMoodleUserInput } from "./create-user";

export interface IUserService {
    createUser(data: any[]): Promise<any>;
    updateUser(id: number, data: Partial<CreateMoodleUserInput>): Promise<any>;
    getUser(id: number): Promise<any>;
    deleteUser(id: number): Promise<any>;
    getUserByField(field:string,value:string | string[]):Promise<any>;
}
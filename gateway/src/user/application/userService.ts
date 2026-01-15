import { HttpService } from "@/shared/application/http.service";
import { CreateMoodleUserInput, MoodleCustomField, MoodleUserPreference } from "../domain/create-user";
import { IUserService } from "../domain/user-service";
import { Logger } from "@/shared/infrastructure/logger";
import { number } from "zod";
import { Role } from "../domain/role-map";


export class UserService implements IUserService {
    constructor(private httpService:HttpService,private log:Logger){}

    async createUser(data: CreateMoodleUserInput): Promise<any> {
        const existingUsers:any[] = await this.getUserByField('username', data.username);
        if(existingUsers && existingUsers.length > 0){
            const existingUser = existingUsers[0];
            return {
                user: {
                    username: existingUser?.username ?? data.username,
                    fechaTransaccion: existingUser?.fechaTransaccion ?? new Date().toISOString(),
                    codigoError:'101',
                    mensajeError:'El usuario ya existe'
                }
            };
        }

    const params = this.buildUserParams(data, 'users');
        this.log.info(`Creating user with params: ${JSON.stringify(params)}`);
        const moodleResponse = await this.httpService.getRequest('create_users',params);
        const createdUser = Array.isArray(moodleResponse) ? moodleResponse[0] : moodleResponse;
        if( data.courseid && data.role ){
            await this.asignRoleAndCourse(data.role, data.courseid,createdUser?.id);
        } 

        return {
            user: {
                username: createdUser?.username ?? data.username,
                id: createdUser?.id,
                fechaTransaccion: new Date().toISOString(),
                codigoError:'0',
                mensajeError:'Usuario creado exitosamente'
            }
        };
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

    private buildUserParams(user: object, baseKey: string): Record<string, string> {
        const params: Record<string, string> = {};
        const userIndex = 0;

        const setParam = (key: string, value: string | number | boolean) => {
            params[`${baseKey}[${userIndex}][${key}]`] = String(value);
        };

        Object.entries(user).forEach(([key, value]) => {
            if(value === undefined || value === null) {
                return;
            }

            if(key === 'preferences' && Array.isArray(value)) {
                this.appendPreferences(params, baseKey, userIndex, value as MoodleUserPreference[]);
                return;
            }

            if(key === 'customfields' && Array.isArray(value)) {
                this.appendCustomFields(params, baseKey, userIndex, value as MoodleCustomField[]);
                return;
            }

            setParam(key, value as string | number | boolean);
        });

        return params;
    }

    private appendPreferences(params: Record<string, string>, baseKey: string, userIndex: number, preferences: MoodleUserPreference[]) {
        preferences.forEach((preference, index) => {
            if(preference.type) {
                params[`${baseKey}[${userIndex}][preferences][${index}][type]`] = preference.type;
            }
            if(preference.value !== undefined) {
                params[`${baseKey}[${userIndex}][preferences][${index}][value]`] = String(preference.value);
            }
        });
    }

    private appendCustomFields(params: Record<string, string>, baseKey: string, userIndex: number, customFields: MoodleCustomField[]) {
        customFields.forEach((field, index) => {
            if(field.type) {
                params[`${baseKey}[${userIndex}][customfields][${index}][type]`] = field.type;
            }
            if(field.value !== undefined) {
                params[`${baseKey}[${userIndex}][customfields][${index}][value]`] = field.value;
            }
        });
    }

    private asignRoleAndCourse(role:string,  courseid: number,userid: number)  {
        const data = {
            roleid : Role[role as keyof typeof Role],
            courseid : courseid,
            userid: userid
        }
        const params = this.buildUserParams(data, 'enrolments');
        this.log.info(`Enrolling user with params: ${JSON.stringify(params)}`);
        return this.httpService.getRequest('enrol_user_to_course',params);
    }
}
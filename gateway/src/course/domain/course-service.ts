export interface ICourseService {
    getCoursesByUserId(userId: number,wsToken:string) : Promise<any>;
}
import { MOODLE_URL } from "@/constants";
import { Logger } from "../infrastructure/logger";
import { defaultParams, functionMap } from "../infrastructure/function-map";

export class HttpService {
    private baseUrl:string;
    private defaultParams:object;
    constructor(private logger:Logger){
        this.baseUrl = MOODLE_URL;
        this.defaultParams = defaultParams; 
    }

    async getRequest(functionKey: keyof typeof functionMap, params: object,resolveToken:boolean = false): Promise<any> {
        const url = new URL(this.baseUrl);
        const functionKeyValue: string = functionMap[functionKey];
        url.searchParams.append('wsfunction', functionKeyValue);
        Object.entries(this.defaultParams).forEach(([key,value])=>{
            url.searchParams.append(key, value as string);
        });
        if (resolveToken) url.searchParams.delete('wstoken');
        Object.entries(params).forEach(([key,value])=>{
            if(Array.isArray(value))  {
                value.forEach((item,index)=> {
                    url.searchParams.append(`${key}[${index}]`, item.toString());
                })
            }else {
                url.searchParams.append(key, value as string);
            }
        });
        this.logger.info(`Making GET request to ${url.toString()}`);
        const response = await fetch(url.toString(),{
            method: 'GET',
        });
        if(!response.ok){
            this.logger.error(`GET request failed with status ${response.status}`);
            return Promise.reject(new Error(`GET request failed with status ${response.status}`));
        }
        return response.json();
    }
}
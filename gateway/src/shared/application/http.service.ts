import { MOODLE_URL } from "@/constants";
import { Logger } from "../infrastructure/logger";
import { defaultParams, functionMap } from "../infrastructure/function-map";
import { PassThrough } from "node:stream";
import FormData from "form-data";
import axios from "axios";

export class HttpService {
    private baseUrl:string;
    private defaultParams:object;
    constructor(private logger:Logger){
        this.baseUrl = MOODLE_URL;
        this.defaultParams = defaultParams;
    }

    async getRequest(functionKey: keyof typeof functionMap, params: object, resolveToken:boolean = false): Promise<any> {
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
        try {
            const response = await axios.get(url.toString());
            return response.data;
        } catch (error: any) {
            const status = error.response?.status || 'unknown';
            this.logger.error(`GET request failed with status ${status}`);
            return Promise.reject(new Error(`GET request failed with status ${status}`));
        }
    }

    async postRequest(baseUrl: string, body: object, file: {value: PassThrough, metadata: {filename: string, contentType: string}}): Promise<any> {
        this.logger.info(`Making POST request to ${baseUrl}`);
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (file) {
            formData.append('file', file.value, {
                filename: file.metadata.filename,
                contentType: file.metadata.contentType,
            });
        }
        try {
            const response = await axios.post(baseUrl, formData, {
                headers: formData.getHeaders(),
            });
            return response.data;
        } catch (error: any) {
            const status = error.response?.status || 'unknown';
            this.logger.error(`POST request failed with status ${status}`);
            return Promise.reject(new Error(`POST request failed with status ${status}`));
        }
    }
}
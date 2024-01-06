import { IResponse } from "../../domain/http/baseResponse.types"


export const generateResponse= <T>(data: T, message: string, requirement: string, status_code: number) => {
    const response: IResponse<{}> | IResponse<any> = {
        data: data,
        message: message,
        requirement: requirement,
        status_code: status_code
    };
    return response;
}
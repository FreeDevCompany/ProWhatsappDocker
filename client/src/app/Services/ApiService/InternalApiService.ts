import { BaseApiService } from "../../@types/ApiTypes";
import { IRequestModel, IErrorModel, IResponseModel } from "../../@types/ApiTypes/BaseHttpTypes";
import { ApiProccessHandler } from "../../Utilities/Helpers/ApiProccessHelper";
import { RequestTypes } from "../../Utilities/Constants/RequestTypes";



class InternalApiService implements BaseApiService {
    public PostAsync = async <TBodyType, TResponseType>(request: IRequestModel<TBodyType>): Promise<IResponseModel<TResponseType> | IErrorModel> => {
        return await ApiProccessHandler.ReceiptResponse(
            RequestTypes.POST,
            request,
        ).then((response) => {
            let myResponse: IResponseModel<TResponseType> = {
                data: response.data.data,
                message: response.data.message,
                requirement: response.data.requeirement,
                status_code: response.status
            }
            return myResponse;
        }).catch(
            (error) => {
                let myError: IErrorModel = {
                    message: error.response.data.message,
                    requirement: error.response.data.requirement,
                    status_code: error.response.status
                }
                throw myError;
            }
        );
    }
    public PutAsync = async <TBodyType, TResponseType>(request: IRequestModel<TBodyType>): Promise<IResponseModel<TResponseType> | IErrorModel> => {
        return await ApiProccessHandler.ReceiptResponse(
            RequestTypes.PUT,
            request,
        ).then((response) => {
            let myResponse: IResponseModel<TResponseType> = {
                data: response.data.data,
                message: response.data.message,
                requirement: response.data.requeirement,
                status_code: response.status
            }
            return myResponse;
        }).catch(
            (error) => {
                let myError: IErrorModel = {
                    message: error.response.data.message,
                    requirement: error.response.data.requirement,
                    status_code: error.response.status
                }
                throw myError;
            }
        );
    }
    public PatchAsync = async <TBodyType, TResponseType>(request: IRequestModel<TBodyType>): Promise<IResponseModel<TResponseType> | IErrorModel> => {
        return await ApiProccessHandler.ReceiptResponse(
            RequestTypes.PATCH,
            request,
        ).then((response) => {
            let myResponse: IResponseModel<TResponseType> = {
                data: response.data.data,
                message: response.data.message,
                requirement: response.data.requeirement,
                status_code: response.status
            }
            return myResponse;
        }).catch(
            (error) => {
                let myError: IErrorModel = {
                    message: error.response.data.message,
                    requirement: error.response.data.requirement,
                    status_code: error.response.status
                }
                throw myError;
            }
        );

    }
    public DeleteAsync = async <TBodyType, TResponseType>(request: IRequestModel<TBodyType>): Promise<IResponseModel<TResponseType> | IErrorModel> => {
        return await ApiProccessHandler.ReceiptResponse(
            RequestTypes.DELETE,
            request,
        ).then((response) => {
            let myResponse: IResponseModel<TResponseType> = {
                data: response.data.data,
                message: response.data.message,
                requirement: response.data.requeirement,
                status_code: response.status
            }
            return myResponse;
        }).catch(
            (error) => {
                let myError: IErrorModel = {
                    message: error.response.data.message,
                    requirement: error.response.data.requirement,
                    status_code: error.response.status
                }
                throw myError;
            }
        );

    }
    public GetAsync = async <TBodyType, TResponseType>(request: IRequestModel<TBodyType>): Promise<IResponseModel<TResponseType> | IErrorModel> => {
        return await ApiProccessHandler.ReceiptResponse(
            RequestTypes.GET,
            request,
        ).then((response) => {
            let myResponse: IResponseModel<TResponseType> = {
                data: response.data.data,
                message: response.data.message,
                requirement: response.data.requeirement,
                status_code: response.status
            }
            return myResponse;
        }).catch(
            (error) => {
                let myError: IErrorModel = {
                    message: error.response.data.message,
                    requirement: error.response.data.requirement,
                    status_code: error.response.status
                }
                throw myError;
            }
        );

    }
}

export { InternalApiService };
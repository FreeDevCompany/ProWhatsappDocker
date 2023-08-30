import { IRequestModel, IResponseModel, IErrorModel } from "./BaseHttpTypes"
export interface BaseApiService {

    PostAsync: <TBodyType, TResponseType>(request: IRequestModel<TBodyType>) => Promise<IResponseModel<TResponseType> | IErrorModel>
    PutAsync: <TBodyType, TResponseType>(request: IRequestModel<TBodyType>) => Promise<IResponseModel<TResponseType> | IErrorModel>
    GetAsync: <TBodyType, TResponseType>(request: IRequestModel<TBodyType>) => Promise<IResponseModel<TResponseType> | IErrorModel>
    DeleteAsync: <TBodyType, TResponseType>(request: IRequestModel<TBodyType>) => Promise<IResponseModel<TResponseType> | IErrorModel>
    PatchAsync: <TBodyType, TResponseType>(request: IRequestModel<TBodyType>) => Promise<IResponseModel<TResponseType> | IErrorModel>
}
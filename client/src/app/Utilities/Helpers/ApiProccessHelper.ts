import axios, { AxiosResponse } from "axios";
import { IRequestModel, IErrorModel } from "../../@types/ApiTypes/BaseHttpTypes"
import { RequestTypes } from "../Constants/RequestTypes"
import { RequestBuilder } from "./RequestBuilder"
export class ApiProccessHandler {

    public static ReceiptResponse = async <T>(
        requestType: RequestTypes,
        requestModel: IRequestModel<T>,
    ): Promise<AxiosResponse<any, any>> => {
        let token: string = "";
        let header: Record<string, string> = RequestBuilder.BuildHeaderForInternal(
            requestModel.isAuthNecessary ? {
                Authorization: `Bearer ${token
                    }`
            } : {}
        )
        switch (requestType) {
            case RequestTypes.GET: {
                return await axios.get(
                    RequestBuilder.SetEndPoint(`${requestModel.endpoint}/`) as string,
                    {
                        headers: header
                    }
                )
            }
            case RequestTypes.DELETE: {
                return await axios.delete(
                    RequestBuilder.SetEndPoint(`${requestModel.endpoint}/${requestModel.id ? requestModel.id : ""}`) as string,
                    { headers: header }

                )
            }

            case RequestTypes.PATCH: {
                return await axios.patch(RequestBuilder.SetEndPoint(requestModel.endpoint) as string,
                    {
                        body: requestModel.body ? requestModel.body : {}
                    })
            }
            case RequestTypes.POST: {
                return await axios.post(
                    RequestBuilder.SetEndPoint(`${requestModel.endpoint}/`) as string,
                    requestModel.body,
                    { headers: header }
                )
            }
            case RequestTypes.PUT: {
                return await axios.put(
                    RequestBuilder.SetEndPoint(`${requestModel.endpoint}/`) as string,
                    requestModel.body ? requestModel.body : {},
                    { headers: header }
                )
            }
        }
    }

    public static HandleRejection = (isAuthNecessary: boolean, error_response: IErrorModel) => {
        if (isAuthNecessary && error_response.message === 'Unauthorized' && error_response.status_code === 401) {
            // todo:: cookie operations

            window.location.href = "/auth/login";
        }
    }
}
export interface IRequestModel<T> {
    id?: string;
    endpoint: string;
    isAuthNecessary: boolean;
    body?: T,
    headers: number;
}
export interface IResponseModel<T> {
    message: string;
    status_code: Number;
    data: T
    requirement: string
}
export interface IResponsePaginationModel<T> {
    message: string;
    status_code: Number;
    data: T
    requirement: string
}
export interface IErrorModel {
    message: string;
    status_code: Number;
    requirement: string;
}
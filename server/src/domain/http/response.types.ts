////////Default Response/////////

interface IResponse<T> {
    status_code: Number;
    message: string;
    data: T;
    requirement: string;
}
////////Pagination Response/////////
interface IMetaData {
    totalItems: Number;
    totalPages: Number;
    currentPage: Number;
    pageSize: Number;
}
interface IPaginationResponse<T>
{
    status_code : Number;
    message: string;
    data: Array<T>;
    meta: IMetaData;
    requirement: string;
}

export {IResponse, IMetaData, IPaginationResponse}
////////Default Response/////////

interface IResponse<T> {
    status_code: Number;
    message: string;
    data: T;
    requirement: string;
}
////////Pagination Response/////////
interface IMetaData {
    page: number;
    perpage: number;
    totalPages: number;
    totalItems: number;
    links: Array<{label: string; active: boolean; url: string | null; page: number | null}>

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
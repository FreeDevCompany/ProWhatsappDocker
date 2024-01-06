

export interface BasePaginateModel<T>
{
    data: Array<T>;
    perPage: number;
    currentPage: number;
    totalPage: number;
    totalItems: number;
}
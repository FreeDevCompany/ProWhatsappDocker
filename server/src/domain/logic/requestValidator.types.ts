import { Schema } from "joi";

export interface IRequestValidator
{
    headers?: Schema,
    body?: Schema,
    params?: Schema,
    query?: Schema,
}
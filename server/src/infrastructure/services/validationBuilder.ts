import { Schema } from "joi";
import { IRequestValidator } from "../../domain/logic/requestValidator.types";
import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";

@injectable()
export class ValidationBuilder
{
    private validator: IRequestValidator = {};
    private addHeader(headerSchema: Schema)
    {
        this.validator.headers = headerSchema;
    }
    private addBody(bodySchema: Schema)
    {
        this.validator.body = bodySchema;
    }
    private addQuery(querySchema: Schema)
    {
        this.validator.query = querySchema;
    }
    private addParams(paramsSchema: Schema)
    {
        this.validator.params = paramsSchema;
    }
    build(headers: Schema, body: Schema, query: Schema, params: Schema): (req:Request, res: Response, next: NextFunction) => void
    {
        this.validator = {};
        this.addHeader(headers)
        this.addBody(body)
        this.addParams(params)
        this.addQuery(query)
        let tempValidation = this.validator;
        return (req:Request, res: Response, next: NextFunction) => 
        {
            const {headers, body, params, query} = tempValidation;
            if(headers)
            {
                let result = headers.validate(req.headers);
                if(result.error)
                    res.status(400).send({message:"Invalid headers", details: result.error.details});
            }
            if(body)
            {
                let result = body.validate(req.body);
                if(result.error)
                    res.status(400).send({message:"Invalid body", details: result.error.details});
            }
            if(query)
            {
                let result = query.validate(req.query);
                if(result.error)
                    res.status(400).send({message:"Invalid query", details: result.error.details});
            }
            if(params)
            {
                let result = params.validate(req.params);
                if(result.error)
                    res.status(400).send({message:"Invalid params", details: result.error.details});
            }
            next();
        }
    }
}
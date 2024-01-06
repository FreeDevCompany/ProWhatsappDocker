
import {Request, Response} from 'express';
export class ErrorHandler {
    static UnhandledExceptionHanlder = (asyncFunction: (req: Request, res:Response) => Promise<Response<any, Record<string, any>>>) => {
        return async (req: Request, res: Response) => {
            try {
                await asyncFunction(req, res);
            }
            catch(error)
            {
                res.status(500).send({
                    data: {},
                    message: error.message,
                    requirement: "",
                    status_code: 500
                })
            }
        }
    };
} 

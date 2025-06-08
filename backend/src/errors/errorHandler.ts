import { Request, Response, NextFunction } from "express"
import ApiError from "./apiError.ts"

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction)  {
    if(err instanceof ApiError)
        res.status(err.status).json(err);
    else {
        const errMessage = "something unexpected happened on the server"
        const newError = new ApiError(500, {}, [errMessage])
        res.status(newError.status).json(newError);
    }
}

export default errorHandler;
import { Request, Response, NextFunction } from "express"
import ApiError from "./apiError.ts"
import { NotFoundError } from "./notFoundError.ts";
import { AuthorizationError } from "./AuthorizationError.ts";

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction)  {
    if(err instanceof ApiError || err instanceof NotFoundError || err instanceof AuthorizationError)
        res.status(err.status).json(err);
    else {
        const errMessage = "something unexpected happened on the server"
        const newError = new ApiError(500, {}, [errMessage])
        res.status(newError.status).json(newError);
    }
}

export default errorHandler;
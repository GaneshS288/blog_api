import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../envConfig.ts";
import ApiError from "../errors/apiError.ts";
import { findUserById } from "../db/userQueries.ts";

/**
 * This function takes in the authorization header with Bearer schema and extracts the jwt token.
 * if the schema is incorrect or the token is invalid an error will be thrown
 * @param authHeader the authorization header from request
 * @returns the payload of the jwt token included the authorization header
 */

function tokenExtractor(authHeader: unknown) {
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, JWT_SECRET);
        return decodedToken;
    } else {
        throw new Error("header not present or invalid auth schema");
    }
}

/**
 * Extracts user from the jwt token and attaches it to req.user field. Throws error if user is null or token extraction fails
 * @param req the express request object
 * @param res the express response object
 * @param next express next function
 */

async function userExtractor(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get("Authorization");

    try {
        const tokenData = tokenExtractor(authHeader);

        if (typeof tokenData === "object" && tokenData.id !== null) {
            const user = await findUserById(tokenData.id);

            if (user === null) throw new Error("user not found");

            req.user = user;
            next();
        }
    } catch (error) {
        console.log(error);
        const errors = ["invalid token or user"];
        throw new ApiError(401, [], errors);
    }
}

export default userExtractor;

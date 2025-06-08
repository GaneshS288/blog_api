import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod/v4";
import { SALT_ROUNDS } from "../envConfig.ts";
import { createUser, findUserByName } from "../db/userQueries.ts";
import { UserSignupSchema, UserLoginSchema } from "../validation/userSchema.ts";
import { flattenError } from "../validation/validationUtils.ts";
import ApiError from "../errors/apiError.ts";

async function signupUser(req: Request, res: Response, next: NextFunction) {
    const validationResult = UserSignupSchema.safeParse(req.body);

    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        const apiError = new ApiError(400, [], null, validationErrors);
        next(apiError);
        return;
    }

    const { name, password, secretPassword } = validationResult.data;

    const userExists = await findUserByName(name);

    if (userExists) {
        const validationErrors = { name: "this username already exists" };
        const apiError = new ApiError(400, [], null, validationErrors);
        next(apiError);
        return;
    }

    const passwordhash = await bcrypt.hash(password, SALT_ROUNDS);

    await createUser(name, passwordhash);

    res.status(201).json({
        status: 201,
        data: { message: "user successfully created" },
    });
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
    const validationResult = UserLoginSchema.safeParse(req.body);

    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        const apiError = new ApiError(400, [], null, validationErrors);
        next(apiError);
        return;
    }

    const { name, password } = validationResult.data;

    const user = await findUserByName(name);

    if (user === null) {
        const validationErrors = { name: "user doesn't exist" };
        const apiError = new ApiError(400, [], null, validationErrors);
        next(apiError);
        return;
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrect) {
        const validationErrors = { password: "password is incorrect" };
        const apiError = new ApiError(400, [], null, validationErrors);
        next(apiError);
        return;
    }

    const token = jwt.sign({ id: user.remote_id, name: user.name }, "cats");

    res.status(200).json({
        status: 200,
        data: { message: "successfully logged in" },
        token,
    });
}

export { signupUser, loginUser };

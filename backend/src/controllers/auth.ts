import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, SALT_ROUNDS, SECRET_PASSWORD } from "../envConfig.ts";
import { createUser, findUserByName } from "../db/userQueries.ts";
import { UserSignupSchema, UserLoginSchema } from "../validation/userSchema.ts";
import { flattenError } from "../validation/validationUtils.ts";
import ApiError from "../errors/apiError.ts";

async function signupUser(req: Request, res: Response) {
    const validationResult = UserSignupSchema.safeParse(req.body);

    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        throw new ApiError(400, [], null, validationErrors);
    }

    const { name, password, secretPassword } = validationResult.data;

    const userExists = await findUserByName(name);

    if (userExists) {
        const validationErrors = { name: "this username already exists" };
        throw new ApiError(400, [], null, validationErrors);
    }

    const passwordhash = await bcrypt.hash(password, SALT_ROUNDS);
    const isAdmin = SECRET_PASSWORD === secretPassword ? true : false;
    const successMessage = isAdmin
        ? "admin user successfully created"
        : "user successfully created";

    await createUser(name, passwordhash, isAdmin);

    res.status(201).json({
        status: 201,
        data: { message: successMessage },
    });
}

async function loginUser(req: Request, res: Response) {
    const validationResult = UserLoginSchema.safeParse(req.body);

    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        throw new ApiError(400, [], null, validationErrors);
    }

    const { name, password } = validationResult.data;

    const user = await findUserByName(name);

    if (user === null) {
        const validationErrors = { name: "user doesn't exist" };
        throw new ApiError(400, [], null, validationErrors);
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrect) {
        const validationErrors = { password: "password is incorrect" };
        throw new ApiError(400, [], null, validationErrors);
    }

    const token = jwt.sign({ id: user.remote_id, name: user.name }, JWT_SECRET);

    res.status(200).json({
        status: 200,
        data: { message: "successfully logged in" },
        token,
    });
}

export { signupUser, loginUser };

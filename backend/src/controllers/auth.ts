import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ZodError } from "zod/v4";
import { SALT_ROUNDS } from "../envConfig.ts";
import { createUser, findUserByName } from "../db/userQueries.ts";
import { UserSignupSchema, UserLoginSchema } from "../validation/userSchema.ts";

async function signupUser(req: Request, res: Response) {
    const validationResult = UserSignupSchema.safeParse(req.body);

    if (validationResult.success === false) {
        res.status(400).json(validationResult.error);
        return;
    }

    const { name, password, secretPassword } = validationResult.data;

    const userExists = await findUserByName(name);

    if (userExists) {
        const status = 400;
        const errMessage = "this username already exists";
        res.status(400).json({
            status,
            data: {},
            validationErrors: { name: errMessage },
        });
        return;
    }

    const passwordhash = await bcrypt.hash(password, SALT_ROUNDS);

    await createUser(name, passwordhash);

    res.status(201).json({
        status: 201,
        data: { message: "user successfully created" },
    });
}

async function loginUser(req: Request, res: Response) {
    const validationResult = UserLoginSchema.safeParse(req.body);

    if (validationResult.success === false) {
        res.status(400).json(validationResult.error);
        return;
    }

    const { name, password } = validationResult.data;

    const user = await findUserByName(name);

    if (user === null) {
        res.status(400).json({
            status: 400,
            validationErrors: { name: "user doesn't exist" },
            data: {},
        });
        return;
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrect) {
        res.status(400).json({
            status: 400,
            data: { error: "password is incorrect" },
        });
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

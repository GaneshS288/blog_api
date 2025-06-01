import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { createUser, findUserByName } from "../db/userQueries.ts";

async function signupUser(req: Request, res: Response) {
    const {
        name,
        password,
        secretPassword,
    }: { name: string; password: string; secretPassword: string } = req.body;

    const userExists = await findUserByName(name);

    if (userExists) {
        const status = 400;
        const errMessage = `A user with name '${name}' already exists`;
        res.status(400).json({ status, data: { error: errMessage } });
        return;
    }

    const passwordhash = await bcrypt.hash(password, 12);

    await createUser(name, passwordhash);

    res.status(201).json({
        status: 201,
        data: { message: "user successfully created" },
    });
}

export { signupUser };

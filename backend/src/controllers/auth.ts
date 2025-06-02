import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

async function loginUser(req: Request, res: Response) {
    const { name, password }: { name: string; password: string } = req.body;
    const user = await findUserByName(name);

    if (user === null) {
        res.status(400).json({
            status: 400,
            data: { error: "user doesn't exist" },
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
        data: { message: "Successfully logged in", token },
    });
}

export { signupUser, loginUser };

import { createUser, findUser } from "./db/userQueries.ts";
import prisma from "./db/prisma.ts";
import express from "express";

const app = express();

await prisma.users.deleteMany();

const user = await createUser("ganesh", "avssds", true);
console.log(user);
const foundUser = await findUser(user.id);
console.log(foundUser);



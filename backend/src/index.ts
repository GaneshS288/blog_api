import { createUser, findUser } from "./db/userQueries.ts";
import express from "express";

const user = await createUser("ganesh", "avssds", true);
console.log(user);
const foundUser = await findUser(user.id);
console.log(foundUser);



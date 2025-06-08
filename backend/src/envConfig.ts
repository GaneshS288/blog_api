import "dotenv/config";

const DATABASE_URL =
    process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL;

if (DATABASE_URL === undefined) {
    throw new Error("Database URL not provided");
}

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

if (!SALT_ROUNDS) throw new Error("salt rounds not specified for bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET) throw new Error("JWT secret not provided");

 const SECRET_PASSWORD = process.env.SECRET_PASSWORD;

 if(!SECRET_PASSWORD) throw new Error("SECRET_PASSWORD not provided");

export { DATABASE_URL, SALT_ROUNDS, JWT_SECRET, SECRET_PASSWORD };

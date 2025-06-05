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

export { DATABASE_URL, SALT_ROUNDS };

import "dotenv/config";

const DATABASE_URL =
    process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL;

if(DATABASE_URL === undefined) {
    throw new Error("Database URL not provided");
}

export { DATABASE_URL };

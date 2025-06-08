import "dotenv/config";

/**
 * This function checks if the given enviroment variable is empty string, '0' or falsy.
 * If the above conditions are met an error will be thrown with message specifying enviroment variable's name
 * @param envVar the enviroment variable to check
 * @param envVarName name of enviroment variable
 */
function assertEnvVar(envVar: string | number, envVarName: string) {
    const errMessage = `${envVarName} enviroment varibale not provided`;
    if (typeof envVar === "string" && envVar.trim() === "")
        throw new Error(errMessage);
    else if (envVar === 0 || Number.isNaN(envVar)) throw new Error(errMessage);
    else if (!envVar) throw new Error(errMessage);
}

const DATABASE_URL =
    (process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL) ?? "";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? "0");
const JWT_SECRET = process.env.JWT_SECRET ?? "";
const SECRET_PASSWORD = process.env.SECRET_PASSWORD ?? "";

assertEnvVar(DATABASE_URL, "DATABASE_URL");
assertEnvVar(SALT_ROUNDS, "SALT_ROUNDS");
assertEnvVar(JWT_SECRET, "JWT_SECRET");
assertEnvVar(SECRET_PASSWORD, "SECRET_PASSWORD");

export { DATABASE_URL, SALT_ROUNDS, JWT_SECRET, SECRET_PASSWORD };

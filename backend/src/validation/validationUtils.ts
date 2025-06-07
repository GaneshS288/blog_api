import { ZodError, z } from "zod/v4";
/**
 * This function takes in a string and if the string contains any of these characters (<>&'"/),
 * it replaces them with html entities.
 * @param text
 * @returns a string that has (<>%'"/) replaced with html entities
 */

function escapeHtml(text: string) {
    const map: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&#39;",
        '"': "&quot;",
        "/": "&#47;",
    };
    return text.replace(/[<>&'"/]/g, (char: string): string => map[char]);
}

/**
 *
 * @param error A zodError thrown by an object schema
 * @returns An object with schema keys as property name and the error string as their value.
 * eg {
 *   name: "name must be at least 4 characters long"
 * }
 */

function flattenError(error: ZodError<object>) {
    const treefiedError = z.treeifyError(error);

    if (treefiedError.properties !== undefined) {
        //assert properties type otherwise typescript will complain
        const properties = treefiedError.properties as Record<
            string,
            { errors: string[] }
        >;
        const flattenedError: Record<string, string> = {};

        for (const property in properties) {
            const errorMessages = properties[property]?.errors;
            if (errorMessages && errorMessages.length > 0) {
                flattenedError[property] = errorMessages[0]; // Extract first error message
            }
        }

        return flattenedError;
    } else {
        return {};
    }
}
export { escapeHtml, flattenError };

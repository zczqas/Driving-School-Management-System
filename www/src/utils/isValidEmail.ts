/**
 * Checks if the provided string is a valid email.
 *
 * @param email - The string to be checked.
 * @returns True if the string is a valid email, otherwise false.
 */
function isValidEmail(email: string): boolean {
    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default isValidEmail;
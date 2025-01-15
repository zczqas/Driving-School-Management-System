// utils/codeGenerator.ts
import crypto from 'crypto';

/**
 * Generates a secure 7-character alphanumeric code.
 * @returns {string} The generated alphanumeric code.
 */
export function generateSecureCode(): string {
    const length = 7;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let result = '';

    // Generate random values using the crypto module
    const randomValues = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        // Map each random value to a character in the characters string
        result += characters.charAt(randomValues[i] % charactersLength);
    }

    return result;
}


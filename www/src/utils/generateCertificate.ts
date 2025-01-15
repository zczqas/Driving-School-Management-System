import crypto from 'crypto';

/**
 * Generates a certificate string based on the provided school name, year, and ID,
 * concatenates it with a cryptographic hash, ensuring the hash does not exceed 6 digits.
 * @param {string} schoolName - The name of the school.
 * @param {number} year - The year of the certificate.
 * @param {string} id - The ID associated with the certificate.
 * @returns {string} The generated certificate string with concatenated hash.
 * @deprecated This function is deprecated. Certificate generation is now handled by the backend.
 */
export default function generateCertificateWithHash(schoolName : string, year : number, id :number) {
    console.warn("This function is deprecated. Certificate generation is now handled by the backend.");

    // Replace any spaces in schoolName with underscores
    const formattedSchoolName = schoolName.replace(/\s+/g, '_');

    // Generate the certificate string
    const certificate = `${formattedSchoolName}-${id}-gc-${year}`;

    // Generate cryptographic hash
    const hash = crypto.createHash('sha256').update(certificate).digest('hex');

    // Take a substring of the hash to limit it to 6 characters
    const truncatedHash = hash.substring(0, 6);

    // Concatenate the certificate with the truncated hash
    const certificateWithHash = `${certificate}-${truncatedHash}`;

    return certificateWithHash;
}

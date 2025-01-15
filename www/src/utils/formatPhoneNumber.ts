/**
 * Utility function to format a phone number in the format 123-456-7890
 * @param phoneNumber - The input phone number as a string
 * @returns The formatted phone number or an error message if invalid
 */
function formatPhoneNumber(phoneNumber: any) {
  // Remove all non-numeric characters
  const cleaned = phoneNumber?.replace(/\D/g, "");

  // Check if the cleaned number has exactly 10 digits
  if (cleaned?.length !== 10) {
    return phoneNumber;
  }

  // Format the number as 123-456-7890
  const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

  return formatted;
}

export default formatPhoneNumber;

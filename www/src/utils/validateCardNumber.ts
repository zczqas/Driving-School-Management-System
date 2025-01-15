export function isValidCardNumber(cardNumber: string): boolean {
    // Remove all non-digit characters
    const sanitized = cardNumber.replace(/\D/g, '');
  
    // Check if the sanitized card number has the correct length
    if (sanitized.length < 13 || sanitized.length > 19) {
      return false;
    }
  
    let sum = 0;
    let shouldDouble = false;
  
    // Iterate over the card number digits from right to left
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized.charAt(i), 10);
  
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
  
      sum += digit;
      shouldDouble = !shouldDouble;
    }
  
    // Valid card numbers will have a sum that is a multiple of 10
    return sum % 10 === 0;
  }
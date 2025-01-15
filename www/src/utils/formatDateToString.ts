import moment from "moment";

/**
 * Converts a date string from 'YYYY-MM-DD' format to 'DD - MMM - YYYY' format using moment.js.
 *
 * @param dateStr - The date string in 'YYYY-MM-DD' format.
 * @returns The formatted date string in 'DD - MMM - YYYY' format.
 */
function formatDateToString(dateStr: string): string {
  // Parse the input date string and format it in 'DD - MMM - YYYY' format
  return moment(dateStr, "YYYY-MM-DD").format("MM-DD-YYYY");
}

export default formatDateToString;

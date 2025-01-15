import moment from 'moment';

/**
 * Generates an array of Monday dates with a two-week interval, starting 
 * from a specified number of years in the past.
 *
 * @param yearsBack The number of years to look back (defaults to 2).
 * @returns An array of formatted Monday dates (YYYY-MM-DD).
 */
function getBiweeklyMondays(yearsBack: number = 2): string[] {
  // Get today's date and calculate the starting Monday two years ago.
  const today = moment();
  const startDate = today.clone().subtract(yearsBack, 'years').startOf('isoWeek'); 

  // Calculate the ending Monday (the Monday of the current week).
  const endDate = today.clone().startOf('isoWeek');

  const dates: string[] = [];

  // Iterate through the date range, adding each Monday to the array.
  while (startDate.isSameOrBefore(endDate)) {
    dates.unshift(startDate.format('MM-DD-YYYY')); // Format the date as YYYY-MM-DD
    startDate.add(2, 'weeks'); // Move to the next Monday two weeks ahead
  }

  return dates;
}

export default getBiweeklyMondays;
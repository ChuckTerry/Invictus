/**
 * Determines the current build time as fully elapsed minutes since the
 * begginning of the current year, 0 padded to 6 digits.
 * @returns {string} The build time as a 6 digit string
 */
export function getBuildTime() {
  const monthMinuteLookup = [
    0,      // January
    44640,  // February - Always count as 29 days
    86400,  // March
    131040,  // April
    174240,  // May
    218880,  // June
    262080,  // July
    306720,  // August
    351360,  // September
    394560,  // October
    439200,  // November
    483840,  // December
  ]
  const date = new Date();
  const month = date.getMonth();
  const dayOfMonth = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const buildTime = monthMinuteLookup[month] + (dayOfMonth * 1440) + (hours * 60) + minutes;
  const string = buildTime.toString();

  return '0'.repeat(6 - string.length) + string;
}

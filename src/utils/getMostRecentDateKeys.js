import sortDatesArray from './sortDatesArray';

/**
 *
 * @param {array} array Array of dates in YYYY-MM-DD or YYYY-QX format
 * @param {*} numOfDates Number of dates to return. Default: all dates
 * @returns Array of dates
 */

const getMostRecentDateKeys = (array, numOfDates) => {
  const sortedDates = sortDatesArray(array);

  return numOfDates && !isNaN(numOfDates) && numOfDates > 0
    ? sortedDates.slice(0, numOfDates)
    : sortedDates;
};

export default getMostRecentDateKeys;

import moment from 'moment';
import sortDatesArray from './sortDatesArray';

/**
 *
 * @param {array} dates array of dates formatted either in YYYY-MM-DD or YYYY-QX
 * @param {number} numOfDates number of dates wanted to be returned
 * @returns Array of two values. First Value: The most recent quarter or the last month in the most recent quarter's date. Second Value: The previous quarter or the last month in previous quarter's date
 */

const getRecentQuarterEndDates = (dates, numOfDates) => {
  const sortedDates = sortDatesArray(dates).filter(date => {
    // Remove months that do not represent the end of a quarter
    const isQuarter = date.includes('Q');
    const month = !isQuarter ? moment(date, 'YYYY-MM-DD').month() + 1 : null;
    return isQuarter || month === 3 || month === 6 || month === 9 || month === 12;
  });

  return sortedDates.slice(0, numOfDates);
};

export default getRecentQuarterEndDates;

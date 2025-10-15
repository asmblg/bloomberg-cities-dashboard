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
    // console.log(sortedDates);
    // Remove months that do not represent the end of a quarter
    const regex = /([Qq])/;
    const isQuarter = regex.test(date);
    const isOnlyYear = date.length === 4;
    const month = !isQuarter && !isOnlyYear
      ? parseInt(date.split('-')[1]) // moment(date, 'YYYY-MM-DD').locale('us').month()
      : null;
    return isOnlyYear || isQuarter || month === 3 || month === 6 || month === 9 || month === 12;
  });

  // console.log(sortedDates);


  return sortedDates.slice(0, numOfDates);
};

export default getRecentQuarterEndDates;

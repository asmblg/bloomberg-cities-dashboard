import moment from 'moment';
import getRecentQuarterEndDates from './getRecentQuarterEndDates';

/**
 *
 * @param {array} dateKeys Array of string dates in YYYY-QX or YYYY-MM-DD format
 * @param {string} compareType Either QtQ (quarter-to-quarter) or YtY (year-to-year)
 * @returns {object} { mostRecentDate, previousDate } in the appropriate format
 */

const getDataCompareDates = (dateKeys, compareType) => {
  const obj = { mostRecentDate: null, previousDate: null };

  if (compareType === 'QtQ') {
    const [currentDate, compareDate] = getRecentQuarterEndDates(dateKeys, 2);
    obj.currentDate = currentDate;
    obj.compareDate = compareDate;
  }

  if (compareType === 'YtY') {
    const sortedDates = getRecentQuarterEndDates(dateKeys);
    const mostRecentDate = sortedDates[0];
    obj.currentDate = mostRecentDate;

    if (mostRecentDate.includes('Q')) {
      const quarterNum = moment(mostRecentDate, 'YYYY-QX').quarter();
      const year = moment(mostRecentDate, 'YYYY-QX').subtract(1, 'year').year();
      obj.compareDate = `${year}-Q${quarterNum}`;
    } else {
      const dateString = moment(new Date(mostRecentDate)).subtract(1, 'year').format('YYYY-MM-DD');
      obj.compareDate = dateString;
    }
  }
  return obj;
};

export default getDataCompareDates;

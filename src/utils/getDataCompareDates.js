import moment from 'moment';
import getRecentQuarterEndDates from './getRecentQuarterEndDates';

/**
 *
 * @param {array} dateKeys Array of string dates in YYYY-QX or YYYY-MM-DD format
 * @param {string} compareType Either QtQ (quarter-to-quarter) or YtY (year-to-year)
 * @returns {object} { currentDate, compareDate } in the appropriate format
 */

const getDataCompareDates = (dateKeys, compareType) => {
  const obj = { currentDate: null, compareDate: null };

  if (compareType === 'QtQ') {
    const [currentDate, compareDate] = getRecentQuarterEndDates(dateKeys, 2);
    obj.currentDate = currentDate;
    obj.compareDate = compareDate;
  }

  if (compareType === 'YtY') {
    const sortedDates = getRecentQuarterEndDates(dateKeys);
    console.log(sortedDates);
    const mostRecentDate = sortedDates[0];
    obj.currentDate = mostRecentDate;
    // const compareDate = sortedDates[0];

    const regex = /([Qq])/;
    if (regex.test(mostRecentDate)) {
      const quarterNum = moment(mostRecentDate, 'YYYY-QX').quarter();
      const year = moment(mostRecentDate, 'YYYY-QX').subtract(1, 'year').year();
      obj.compareDate = `${year}-Q${quarterNum}`;
    } else {
      const dateString = moment(new Date(mostRecentDate)).subtract(1, 'year').format('YYYY-MM-D');
      obj.compareDate = dateString;
    }
  }
  // console.log(obj);
  return obj;
};

export default getDataCompareDates;

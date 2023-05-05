import moment from 'moment';
import getRecentQuarterEndDates from './getRecentQuarterEndDates';
import padDate from './padDate';

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
    // console.log(sortedDates);
    const mostRecentDate = sortedDates[0];
    obj.currentDate = mostRecentDate;
    // const compareDate = sortedDates[0];

    const regex = /([Qq])/;
    if (regex.test(mostRecentDate)) {
      const quarterNum = moment(padDate(mostRecentDate), 'YYYY-QX').utc().quarter();
      const year = moment(padDate(mostRecentDate), 'YYYY-QX').utc().subtract(1, 'year').year();
      obj.compareDate = `${year}-Q${quarterNum}`;
    } else {
      const dateString = moment(padDate(mostRecentDate)).utc().subtract(1, 'year').format('YYYY-MM-D');
      obj.compareDate = dateString;
    }
  }
  // console.log(obj);
  return obj;
};

export default getDataCompareDates;

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

  // console.log(dateKeys);

  if (compareType === 'QtQ') {
    const [currentDate, compareDate] = getRecentQuarterEndDates(dateKeys, 2);
    obj.currentDate = currentDate;
    obj.compareDate = compareDate;
  }

  if (compareType === 'YtY') {
    const sortedDates = getRecentQuarterEndDates(dateKeys);
    const mostRecentDate = sortedDates[0];
    obj.currentDate = mostRecentDate;

    const qtrYrRegex = /^(Q\d) \d{4}$/;
    const yrQtrRegex = /^\d{4}-(Q\d)$/;

    if (qtrYrRegex.test(mostRecentDate)) {
      const quarterNum = moment(padDate(mostRecentDate), 'Q[x] YYYY').utc().quarter();
      const year = moment(padDate(mostRecentDate), 'Q[x] YYYY').utc().subtract(1, 'year').year();
      obj.compareDate = `Q${quarterNum} ${year}`;
    } else if (yrQtrRegex.test(mostRecentDate)) {
      const quarterNum = moment(padDate(mostRecentDate), 'YYYY-QX').utc().quarter();
      const year = moment(padDate(mostRecentDate), 'YYYY-QX').utc().subtract(1, 'year').year();
      obj.compareDate = `${year}-Q${quarterNum}`;
    } else {
      const dateString = moment(padDate(mostRecentDate)).utc().subtract(1, 'year').format('YYYY-MM-D');
      obj.compareDate = dateString;
    }
  }
  return obj;
};

export default getDataCompareDates;

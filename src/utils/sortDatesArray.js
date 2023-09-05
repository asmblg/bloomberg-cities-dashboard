import moment from 'moment';

/**
 *
 * @param {array} array Array of dates in either YYYY-MM-DD or YYYY-QX format
 * @param {string} order Either ascending or descending to determine the order of the sort. Default: descending.
 * @returns array of dates sorted in the specified order
 */

const sortDatesArray = (array, order, dateKey) => {
  const regexQuarter = /^(Q\d) \d{4}$/;
  const regexYearQuarter = /^\d{4}-(Q\d)$/;

  const sortedDates = array.sort((a, b) => {
    const aDate = dateKey ? a[dateKey] : a;
    const bDate = dateKey ? b[dateKey] : b;
    
    const isQuarterA = regexQuarter.test(aDate) || regexYearQuarter.test(aDate);
    const isQuarterB = regexQuarter.test(bDate) || regexYearQuarter.test(bDate);

    if (isQuarterA && isQuarterB) {
      const aMoment = moment(aDate, isQuarterA ? 'Q YYYY' : 'YYYY-QX').utc();
      const bMoment = moment(bDate, isQuarterB ? 'Q YYYY' : 'YYYY-QX').utc();
      
      return order === 'ascending' ? aMoment - bMoment : bMoment - aMoment;
    } else {
      const aNormalDate = moment(aDate, 'YYYY-MM-DD').utc();
      const bNormalDate = moment(bDate, 'YYYY-MM-DD').utc();
      
      return order === 'ascending' ? aNormalDate - bNormalDate : bNormalDate - aNormalDate;
    }
  });
  
  return sortedDates;
};

export default sortDatesArray;

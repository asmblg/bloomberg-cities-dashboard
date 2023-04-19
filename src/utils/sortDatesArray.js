import moment from 'moment';

/**
 *
 * @param {array} array Array of dates in either YYYY-MM-DD or YYYY-QX format
 * @param {string} order Either ascending or descending to determine the order of the sort. Default: descending.
 * @returns array of dates sorted in the specified order
 */

const sortDatesArray = (array, order, dateKey) => {
  const regex = /^\d{4}-(Q\d)$/;

  const sortedDates = array.sort((a, b) => {
    const aDate = dateKey ? a[dateKey] : a;
    const bDate = dateKey ? b[dateKey] : b;
    
    const isQuarter = regex.test(aDate) && regex.test(bDate);

    if (isQuarter) {
      return order === 'ascending'
        ? moment(aDate, 'YYYY-QX') - moment(bDate, 'YYYY-QX')
        : moment(bDate, 'YYYY-QX') - moment(aDate, 'YYYY-QX');
    } else {
      return order === 'ascending'
        ? moment(aDate, 'YYYY-MM-DD') - moment(bDate, 'YYYY-MM-DD')
        : moment(bDate, 'YYYY-MM-DD') - moment(aDate, 'YYYY-MM-DD');
    }
  });
  return sortedDates;
};

export default sortDatesArray;

import moment from 'moment';

/**
 *
 * @param {array} array Array of dates in either YYYY-MM-DD or YYYY-QX format
 * @param {string} order Either ascending or descending to determine the order of the sort. Default: descending.
 * @returns array of dates sorted in the specified order
 */

const sortDatesArray = (array, order) => {
  const regex = /^\d{4}-(Q\d)$/;

  const sortedDates = array.sort((a, b) => {
    const isQuarter = regex.test(a) && regex.test(b);

    if (isQuarter) {
      return order === 'ascending'
        ? moment(a, 'YYYY-QX') - moment(b, 'YYYY-QX')
        : moment(b, 'YYYY-QX') - moment(a, 'YYYY-QX');
    } else {
      return order === 'ascending'
        ? moment(a, 'YYYY-MM-DD') - moment(b, 'YYYY-MM-DD')
        : moment(b, 'YYYY-MM-DD') - moment(a, 'YYYY-MM-DD');
    }
  });
  return sortedDates;
};

export default sortDatesArray;

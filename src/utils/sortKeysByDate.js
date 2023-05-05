import moment from 'moment';

/**
 *
 * @param {object} object with dates as keys
 * @returns Array of the object's keys sorted by date
 */

const sortKeysByDate = object => {
  const keys = Object.keys(object);
  return keys.sort((a, b) => moment(new Date(a)).utc() - moment(new Date(b)).utc());
};

export default sortKeysByDate;

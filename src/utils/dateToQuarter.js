import moment from 'moment';

/**
 *
 * @param {string} date a date string in any format
 * @returns date converted into QX YYYY format
 */
const dateToQuarter = date => {
  const dateObj = moment(new Date(date));
  const quarterNum = dateObj.quarter();
  const year = dateObj.year();

  return `Q${quarterNum} ${year}`;
};

export default dateToQuarter;

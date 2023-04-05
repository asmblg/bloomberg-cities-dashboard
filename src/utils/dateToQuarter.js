import moment from 'moment';

/**
 *
 * @param {string} date a date string in any format
 * @returns date converted into QX YYYY format
 */
const dateToQuarter = (date, format) => {
  const dateObj = date.includes('Q') ? moment(date, 'YYYY-QX') : moment(new Date(date));

  const quarterNum = dateObj.quarter();
  const year = format === 'QX-YY' ? dateObj.format('YY') : dateObj.year();

  return format === 'QX-YY' ? `Q${quarterNum}-${year}` : `Q${quarterNum} ${year}`;
};

export default dateToQuarter;

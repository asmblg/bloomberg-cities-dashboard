import moment from 'moment';

/**
 *
 * @param {string} date a date string in any format
 * @returns date converted into QX YYYY format
 */
const dateToQuarter = (date, format) => {
  const qtrYrRegex = /^(Q\d) \d{4}$/;
  const yrQtrRegex = /^\d{4}-(Q\d)$/;

  const dateObj = yrQtrRegex.test(date)
    ? moment(date, 'YYYY-QX').utc()
    : qtrYrRegex.test(date)
      ? moment(date, 'Q[x] YYYY').utc()
      : moment(date, 'YYYY-M-D').utc();

  const quarterNum = dateObj.add(1, 'day').quarter();
  const year = format === 'QX-YY' ? dateObj.format('YY') : dateObj.year();

  return format === 'QX-YY' ? `Q${quarterNum}-${year}` : `Q${quarterNum} ${year}`;
};

export default dateToQuarter;

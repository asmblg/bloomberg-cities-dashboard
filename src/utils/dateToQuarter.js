import moment from 'moment';

/**
 *
 * @param {string} date a date string in any format
 * @returns date converted into QX YYYY format
 */
const dateToQuarter = (date, format, lng, QtQ) => {
  const localizedQuarterFormat = lng === 'pt';
  const qtrYrRegex = /^(Q\d) \d{4}$/;
  const yrQtrRegex = /^\d{4}-(Q\d)$/;

  const dateObj = yrQtrRegex.test(date)
    ? moment(date, 'YYYY-QX').locale('pt')
    : qtrYrRegex.test(date)
      ? moment(date, 'Q[x] YYYY').locale('pt')
      : moment(date, 'YYYY-M-D').locale('pt');

  const quarterNum = dateObj.add(1, 'day').quarter(); // Adjust quarter number if QtQ is true
  const year = format === 'QX-YY' ? dateObj.format('YY') : dateObj.year();

  return format === 'QX-YY' 
    ? localizedQuarterFormat ?  `T${quarterNum}-${year}` : `Q${quarterNum}-${year}` 
    : localizedQuarterFormat ?  `T${quarterNum} ${year}` : `Q${quarterNum} ${year}`;
};

export default dateToQuarter;

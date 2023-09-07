import moment from 'moment';


const formatQuarterDate = (date, format) => {
  const textArray = date.search(' ') !== -1 ?
    date.split(' ')
    : date.search('-') !== -1 ?
      date.split('-')
      : null;

  if (textArray && format) {
    if (format === 'QX YYYY') {
      if (textArray?.[1]?.match(/q/i)) {
        return textArray.reverse().join(' ');
      }
      if (textArray?.[0]?.match(/q/i)) {     
        return textArray.join(' ');
      }    
    } else if (format === 'QX-YY') {
      const isQtrYr = /^(Q\d) \d{4}$/.test(date);
      const isYrQtr = /^\d{4}-(Q\d)$/.test(date);
      const format = !isQtrYr && !isYrQtr
        ? 'YYYY-MM-D'
        : isQtrYr
          ? 'Q[Q] YYYY'
          : 'YYYY-[Q]Q';

      const dateObj = moment(date, format).utc();

      if (dateObj.isValid()) {
        return dateObj.format('[Q]Q-YY');
      } else {
        const quarterDateToUpper = date.replace('q', 'Q');
        const newDateObj = moment(quarterDateToUpper, 'YYYY-[Q]Q').utc();

        if (newDateObj.isValid()) {
          return newDateObj.format('[Q]Q-YY');
        }
        return '';
      }
    }
  } else {
    return date;
  }

};

export default formatQuarterDate;
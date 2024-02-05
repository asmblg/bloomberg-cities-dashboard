import moment from 'moment';


const formatQuarterDate = (date, format) => {
  let textArray = date.search(' ') !== -1 ?
    date.split(' ')
    : date.search('-') !== -1 ?
      date.split('-')
      : null;
  // When quarter needs to be inferred from standard date like 2023-9-1
  if (textArray.length >= 3) {
    const month = parseInt(textArray[1]);
    const quarter = (month) <= 2 ? 'Q1'
      : month <= 5 ? 'Q2'
        : month <= 8 ? 'Q3'
          : 'Q4';
    textArray = [textArray[0], quarter];

  }



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
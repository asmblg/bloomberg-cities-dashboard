import moment from 'moment';

/**
 *
 * @param {array} array Array of dates in either YYYY-MM-DD or YYYY-QX format
 * @param {string} order Either ascending or descending to determine the order of the sort. Default: descending.
 * @returns array of dates sorted in the specified order
 */

const sortDatesArray = (array, order, dateKey, length) => {
  const regexQuarter = /^(Q\d) \d{4}$/;
  const regexYearQuarter = /^\d{4}-(Q\d)$/;
  const regexJustYear = /^\d{4}$/;

  const sortedDates = array.sort((a, b) => {
    const aDate = dateKey ? a[dateKey] : a;
    const bDate = dateKey ? b[dateKey] : b;

    const isRegexQuarterYear = regexQuarter.test(aDate) && regexQuarter.test(bDate);
    const isRegexYearQuarter = regexYearQuarter.test(aDate) && regexQuarter.test(bDate);

    if (isRegexQuarterYear || isRegexYearQuarter) {
      const aMoment = moment(aDate, isRegexQuarterYear ? 'Q YYYY' : 'YYYY-QX').locale('pt');
      const bMoment = moment(bDate, isRegexQuarterYear ? 'Q YYYY' : 'YYYY-QX').locale('pt');
      
      return order === 'ascending' ? aMoment - bMoment : bMoment - aMoment;
    } else {
      const aNormalDate = moment(aDate, 'YYYY-MM-DD').locale('pt');
      const bNormalDate = moment(bDate, 'YYYY-MM-DD').locale('pt');
      
      return order === 'ascending' ? aNormalDate - bNormalDate : bNormalDate - aNormalDate;
    }
  });

  const maxDate = sortedDates[sortedDates.length - 1];
  // console.log('MAX DATE', maxDate);

  if (length ) {
    // Create consesecutive array of set length ending in max date 
    const missingDates = [];

    const isRegexQuarterYear = regexQuarter.test(maxDate);
    const isRegexYearQuarter = regexYearQuarter.test(maxDate);
    const isRegexJustYear = regexJustYear.test(maxDate);


    if (isRegexQuarterYear || isRegexYearQuarter) {

      const startDate = moment(maxDate, isRegexQuarterYear ? 'Q YYYY' : 'YYYY-QX').locale('pt');
      
      // console.log('startDate', startDate);
      for (let i = 0; i < length; i++) {
        const newDate = moment(startDate).subtract(i, 'Q');
        const newQuarter = newDate.quarter();
        const newYear = newDate.year();
        missingDates.push(isRegexQuarterYear ? `Q${newQuarter} ${newYear}` : `${newYear}-Q${newQuarter}`);
      }
    } else if (isRegexJustYear) {
      const startDate = moment(maxDate, 'YYYY').locale('pt');
      for (let i = 0 ; i < length; i++) {
        const newDate = moment(startDate).subtract(i, 'years');
        missingDates.push(newDate.format('YYYY'));
      }
    } else {
      const startDate = moment(maxDate, 'YYYY-MM-DD').locale('pt');
      for (let i = 0; i < length; i++) {
        const newDate = moment(startDate).subtract(i, 'months');
        missingDates.push(newDate.format('YYYY-MM'));
      }
    }

    // console.log('MISSING DATES', missingDates);
    return order === 'ascending' ? [...missingDates.reverse()] : [...missingDates];
  }

  // if (length && length - sortedDates?.length > 0) {
  //   // Prepend the missing dates
  //   const missingDates = [];

  //   const isRegexQuarterYear = regexQuarter.test(sortedDates[0]);
  //   const isRegexYearQuarter = regexYearQuarter.test(sortedDates[0]);
  //   const isRegexJustYear = regexJustYear.test(sortedDates[0]);


  //   if (isRegexQuarterYear || isRegexYearQuarter) {

  //     const startDate = moment(sortedDates[0], isRegexQuarterYear ? 'Q YYYY' : 'YYYY-QX').locale('pt');
      
  //     // console.log('startDate', startDate);
  //     for (let i = 1; i <= length - sortedDates.length; i++) {
  //       const newDate = moment(startDate).subtract(i, 'Q');
  //       const newQuarter = newDate.quarter();
  //       const newYear = newDate.year();
  //       missingDates.push(isRegexQuarterYear ? `Q${newQuarter} ${newYear}` : `${newYear}-Q${newQuarter}`);
  //     }
  //   } else if (isRegexJustYear) {
  //     const startDate = moment(sortedDates[0], 'YYYY').locale('pt');
  //     for (let i = 1; i <= length - sortedDates.length; i++) {
  //       const newDate = moment(startDate).subtract(i, 'years');
  //       missingDates.push(newDate.format('YYYY'));
  //     }
  //   } else {
  //     const startDate = moment(sortedDates[0], 'YYYY-MM-DD').locale('pt');
  //     for (let i = 1; i <= length - sortedDates.length; i++) {
  //       const newDate = moment(startDate).subtract(i, 'months');
  //       missingDates.push(newDate.format('YYYY-MM'));
  //     }
  //   }
  //   return order === 'ascending' ? [...missingDates.reverse(), ...sortedDates] : [...sortedDates, ...missingDates];
  // }

  return sortedDates;
};

export default sortDatesArray;

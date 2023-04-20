import getCurrentAndCompareData from './getCurrentAndCompareData';
// import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
// import formatValue from '../../utils/formatValue';

// const handleDataForPreviousValueChange = ({ data, compareDate }) => {
//   if (data && compareDate) {
//     console.log(data, compareDate);
//     const dates = getRecentQuarterEndDates(Object.keys(data));
//     const compareIndex = dates.indexOf(compareDate);
//     const slicedDates = dates.slice(1, dates.length - 1);
//     console.log(slicedDates, compareIndex);
//     const obj = {};

//     slicedDates.forEach(date => {
//       obj[date] = data[date];
//     });

//     return obj;
//   }
// };

/**
 *
 * @param {string} calculator - Indicator calculator
 * @param {object} data
 * @param {string} trendDataType - QtQ or YtY. default: QtQ
 * @returns {object} { currentValue, currentDate, compareDate, compareValue }
 */

const createCompareDataObject = (calculator, data, trendDataType, filterArray) => {
  // console.log(data, trendDataType);
  const { currentValue, compareValue, currentDate, compareDate } = getCurrentAndCompareData(
    calculator,
    data,
    trendDataType || 'QtQ',
    filterArray
  );

  const obj = {
    currentValue,
    currentDate,
    compareDate,
    compareValue
  };

  // Handle compare calculations
  switch (calculator) {
    case 'differenceFromPrevious': {
      if (obj.currentValue && obj.compareValue) {
        obj.displayValue =
          parseFloat(obj.currentValue) - parseFloat(obj.compareValue);

        // const updatedDataObj = handleDataForPreviousValueChange({ data, compareDate });
        // const { currentValue: curVal, compareValue: compVal } = getCurrentAndCompareData(
        //   calculator,
        //   updatedDataObj,
        //   trendDataType
        // );
        // console.log(parseFloat(curVal) - parseFloat(compVal));
        // obj.previousDisplayValue = parseFloat(curVal) - parseFloat(compVal);
      }
      break;
    }
    default: {
      obj.displayValue = obj.currentValue;
      break;
    }
  }

  // console.log(obj);

  // obj.displayValue = formatValue(obj.displayValue, formatter);
  return obj;
};

export default createCompareDataObject;

import getCurrentAndCompareData from './getCurrentAndCompareData';
import getRecentQuarterEndDates from './getRecentQuarterEndDates';
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
        const currentVal = parseFloat(obj.currentValue) - parseFloat(obj.compareValue);
        obj.currentValue = currentVal;
        obj.displayValue = currentVal;

        // Filter out most current date to get the compare value difference in total
        const dateKeys = Object.keys(data);
        const [filterDate] = getRecentQuarterEndDates(Object.keys(data), 1);
        const filtersArr = dateKeys.filter(key => key !== filterDate);

        const compareObj = getCurrentAndCompareData(
          calculator,
          data,
          trendDataType,
          filtersArr
        );
        obj.compareValue = parseFloat(compareObj.currentValue) - parseFloat(compareObj.compareValue);
      }
      break;
    }
    default: {
      obj.displayValue = obj.currentValue;
      break;
    }
  }
  return obj;
};

export default createCompareDataObject;

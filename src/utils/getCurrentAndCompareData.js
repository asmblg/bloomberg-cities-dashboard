import getDataCompareDates from './getDataCompareDates';
// import sortDatesArray from './sortDatesArray';

/**
 *
 * @param {object} config
 * @param {object} data
 * @param {string} trendDataType 'YtY' or 'QtQ'
 * @returns {object} { currentValue, compareValue, currentDate, compareDate }
 */

const getCurrentAndCompareData = (calculator, data, trendDataType) => {
  const dateKeys = Object.keys(data);
  // Uses trend type to return two dates (keys) to compare in data object
  const { currentDate, compareDate } = getDataCompareDates(dateKeys, trendDataType);
  const valuesObj = {};

  // Handles calculations needed on values before comparing two values
  switch (calculator) {
    case 'differenceFrom100': {
      valuesObj.currentValue = currentDate ? 100 - parseFloat(data[currentDate]) : null;
      valuesObj.compareValue = compareDate ? 100 - parseFloat(data[compareDate]) : null;
      break;
    }
    default: {
      valuesObj.currentValue = currentDate ? data[currentDate] : null;
      valuesObj.compareValue = compareDate ? data[compareDate] : null;
      break;
    }
  }

  const dataObj = {
    currentValue: valuesObj.currentValue,
    compareValue: valuesObj.compareValue,
    currentDate,
    compareDate
  };
  return dataObj;
};

export default getCurrentAndCompareData;

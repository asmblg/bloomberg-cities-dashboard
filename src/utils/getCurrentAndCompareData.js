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
  const dataObj = {
    currentValue: null,
    compareValue: null,
    currentDate: null,
    compareDate: null
  };
  if (data) {
    const dateKeys = Object.keys(data);
    // Uses trend type to return two dates (keys) to compare in data object
    const { currentDate, compareDate } = getDataCompareDates(dateKeys, trendDataType);
    dataObj.currentDate = currentDate;
    dataObj.compareDate = compareDate;

    // Handles calculations needed on values before comparing two values
    switch (calculator) {
      case 'differenceFrom100': {
        dataObj.currentValue = currentDate ? 100 - parseFloat(data[currentDate]) : null;
        dataObj.compareValue = compareDate ? 100 - parseFloat(data[compareDate]) : null;
        break;
      }
      default: {
        dataObj.currentValue = currentDate ? data[currentDate] : null;
        dataObj.compareValue = compareDate ? data[compareDate] : null;
        break;
      }
    }
  }
  return dataObj;
};

export default getCurrentAndCompareData;

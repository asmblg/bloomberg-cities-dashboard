import getCurrentAndCompareData from './getCurrentAndCompareData';
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

  obj.displayValue = obj.currentValue;
  return obj;
};

export default createCompareDataObject;

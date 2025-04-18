import getCurrentAndCompareData from './getCurrentAndCompareData';
/**
 *
 * @param {string} calculator - Indicator calculator
 * @param {object} data
 * @param {string} trendDataType - QtQ or YtY. default: QtQ
 * @returns {object} { currentValue, currentDate, compareDate, compareValue }
 */

const createCompareDataObject = (calculator, data, trendDataType, filterArray, postCalculator) => {
  const { 
    currentValue,
    compareValue,
    currentDate,
    compareDate 
  } = getCurrentAndCompareData(
    calculator,
    data,
    trendDataType || 'QtQ',
    filterArray,
    postCalculator
  );

  const obj = {
    currentValue,
    currentDate,
    compareDate,
    compareValue
  };

  obj.displayValue = obj?.currentValue || null;
  return obj;
};

export default createCompareDataObject;

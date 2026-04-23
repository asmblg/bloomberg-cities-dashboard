import getCurrentAndCompareData from './getCurrentAndCompareData';
/**
 *
 * @param {string} calculator - Indicator calculator
 * @param {object} data
 * @param {string} trendDataType - QtQ or YtY. default: QtQ
 * @returns {object} { currentValue, currentDate, compareDate, compareValue }
 */

const createCompareDataObject = (
  calculator, 
  data, 
  trendDataType, 
  filterArray, 
  postCalculator, 
  showZeroValues = true
) => {
  const { 
    currentValue,
    compareValue,
    currentDate,
    compareDate 
  } = getCurrentAndCompareData(
    calculator,
    data,
    trendDataType,
    filterArray,
    postCalculator
  );

  // console.log('createCompareDataObject', {calculator, data, trendDataType, filterArray, postCalculator})

  const obj = {
    currentValue,
    currentDate,
    compareDate,
    compareValue
  };

  obj.displayValue = obj?.currentValue || (showZeroValues && obj?.currentValue === 0 ? 0 : null);
  return obj;
};

export default createCompareDataObject;

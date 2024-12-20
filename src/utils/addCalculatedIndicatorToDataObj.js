/**
 *
 * @param {object} indicatorObj indicator config object
 * @param {object} dataObj a data object
 * @returns {object} updated dataObj with new calculated values
 */
const addCalculatedIndicatorToDataObj = (indicatorObj, dataObj) => {
  const data = { ...dataObj };
  if (indicatorObj.calculator && indicatorObj.var) {
    switch (indicatorObj.calculator) {
      case 'percentageOf': {
        if (typeof indicatorObj.var !== 'string') {
          const percentage = calcPercentageOf(indicatorObj, dataObj);

          if (percentage) {
            data[indicatorObj.key] = percentage;
          }
        }
        break;
      }
      case 'sum': {
        if (typeof indicatorObj.var !== 'string') {
          const newValue = rollUpIndicatorValues(indicatorObj.var, dataObj);
          data[indicatorObj.key] =
            indicatorObj.units === 'percent' ? newValue.toFixed(1) : newValue;
        } else {
          data[indicatorObj.key] = dataObj[indicatorObj.var];
        }
        break;
      }
      case 'inversePercentageOf': {
        if (typeof indicatorObj.var !== 'string') {
          const percentage = calcPercentageOf(indicatorObj, dataObj);

          if (percentage) {
            const inversePercentage = 100 - percentage;
            data[indicatorObj.key] = inversePercentage;
          }
        }
        break;
      }
      // starts with first var and takes difference from remaining vars 
      case 'difference': {
        if (typeof indicatorObj.var !== 'string') {
          let newValue = parseFloat(data[indicatorObj.var[0]]);

          for (let i = 1; i <= indicatorObj.var.length - 1; i++) {
            newValue -= parseFloat(data[indicatorObj.var[i]]);
          }
          data[indicatorObj.key] = newValue;
        }
        break;
      }
      case 'differenceFrom100': {
        if (typeof indicatorObj.var === 'string') {
          const newValue = 100 - parseFloat(data[indicatorObj.var]);
          data[indicatorObj.key] = newValue;
        }
        break;
      }
      case 'decimalToPercent': {
        const value = parseFloat(data[indicatorObj.var]) * 100;
        data[indicatorObj.key] = value;
        break;
      }
      default: {
        break;
      }
    }
  }
  return data;
};

/**
 *
 * @param {array} varArray array of indicator variables
 * @param {obj} dataObj a data object
 * @returns {number} sum of varArray values taken from data object
 */
function rollUpIndicatorValues(varArray, dataObj) {
  let sum = 0;
  for (let i = 0; i <= varArray.length - 1; i++) {
    sum += parseFloat(dataObj[varArray[i]] || 0);
  }
  return sum;
}
/**
 *
 * @param {object} indicatorObj
 * @param {object} dataObj
 * @returns {number} 'percentage of' value
 */

function calcPercentageOf(indicatorObj, dataObj) {
  const indicatorsToRollUp = [...indicatorObj.var];
  // Modifies original array and stores last value of array in new variable
  const denominatorKey = indicatorsToRollUp.pop();
  const numerator = rollUpIndicatorValues(indicatorsToRollUp, dataObj);
  const denominator = parseFloat(dataObj[denominatorKey]);

  if (!isNaN(numerator) && !isNaN(denominator)) {
    const newValue = (numerator / denominator) * 100;
    return newValue.toFixed(1);
  }
  return null;
}

export default addCalculatedIndicatorToDataObj;

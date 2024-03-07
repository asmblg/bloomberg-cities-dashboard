import createCompareDataObject from '../../utils/createCompareDataObject';
import getNestedValue from '../../utils/getNestedValue';
// import abbreviateNumber from '../../utils/abbreviateNumber';

const handleTrendDisplayData = (data, indicatorObj, trendDataType) => {
  // if (indicatorObj.preCalculator) {
  //   console.log('*******', indicatorObj.preCalculator, data);
  // }
  if (indicatorObj.calculator) {
    if (typeof indicatorObj.var === 'string' && indicatorObj.var !== 'all-nested-keys') {
      const values = indicatorObj.var.search('.') !== 1 ?
        getNestedValue(data, indicatorObj.var)
        : data[indicatorObj.var];
      return createCompareDataObject(indicatorObj.calculator, values, trendDataType, indicatorObj.filter, indicatorObj.postCalculator);
    } else if (indicatorObj.var === 'all-nested-keys') {
      const dataObj = createCompareDataObject(indicatorObj.calculator, data[indicatorObj.key], trendDataType, indicatorObj.filter, indicatorObj.postCalculator);

      if (dataObj?.currentValue && typeof dataObj.currentValue === 'object') {
        if (indicatorObj.calculator === 'total') {
          const currentTotal = Object.values(dataObj.currentValue).reduce((a, b) => a + b);
          dataObj.currentValue = currentTotal;
          dataObj.displayValue = currentTotal;
        }
  
        if (dataObj.compareValue && typeof dataObj.compareValue === 'object' && indicatorObj.calculator === 'total') {
          const compareTotal = Object.values(dataObj.compareValue).reduce((a, b) => a + b);
          dataObj.compareValue = compareTotal;
        }
      }
      return dataObj;
    } else if (Array.isArray(indicatorObj.var)){
      if (indicatorObj.calculator === 'percentageOf') {

        const numeratorValues = data[indicatorObj.var?.[0]];
        
        // data[indicatorObj.var?.[0]];
        const denominatorValues = data[indicatorObj.var?.[1]];

        const calcaluatedValues = {};

        // console.log(numeratorValues);

        Object.entries(numeratorValues).forEach(([key,value]) =>
          calcaluatedValues[key] = 100 * (value / denominatorValues[key])
        );

        // console.log(calcaluatedValues);

        return createCompareDataObject(indicatorObj.calculator, calcaluatedValues, trendDataType, indicatorObj.filter, indicatorObj.postCalculator);
      }
      return null;
    } else {
      // Handle multiple var calculations - no instances yet
      return null;
    }
  } else {
    return createCompareDataObject(indicatorObj.calculator, data[indicatorObj.key] || data, trendDataType, indicatorObj.filter, indicatorObj.postCalculator);
  }
};

export { handleTrendDisplayData };

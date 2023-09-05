import createCompareDataObject from '../../utils/createCompareDataObject';
import getNestedValue from '../../utils/getNestedValue';
// import abbreviateNumber from '../../utils/abbreviateNumber';

const handleTrendDisplayData = (data, indicatorObj, trendDataType) => {
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
    } else {
      // Handle multiple var calculations - no instances yet
      return null;
    }
  } else {
    return createCompareDataObject(indicatorObj.calculator, data[indicatorObj.key] || data, trendDataType, indicatorObj.filter, indicatorObj.postCalculator);
  }
};

export { handleTrendDisplayData };

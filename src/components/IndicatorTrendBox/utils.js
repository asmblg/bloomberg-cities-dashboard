import createCompareDataObject from '../../utils/createCompareDataObject';
import getNestedValue from '../../utils/getNestedValue';

const handleTrendDisplayData = (data, indicatorObj, trendDataType) => {
  if (indicatorObj.calculator) {
    console.log(indicatorObj.var);
    if (typeof indicatorObj.var === 'string') {
      const values = indicatorObj.var.search('.') !== 1 ?
        getNestedValue(data, indicatorObj.var)
        : data[indicatorObj.var];
      return createCompareDataObject(indicatorObj.calculator, values, trendDataType);
    } else {
      // Handle multiple var calculations - no instances yet
      return null;
    }
  } else {
    return createCompareDataObject(indicatorObj.calculator, data[indicatorObj.key], trendDataType);
  }
};

export { handleTrendDisplayData };

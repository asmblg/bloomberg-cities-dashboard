import createCompareDataObject from '../../utils/createCompareDataObject';

const handleTrendDisplayData = (data, indicatorObj, trendDataType) => {
  if (indicatorObj.calculator) {
    if (typeof indicatorObj.var === 'string') {
      return createCompareDataObject(indicatorObj.calculator, data[indicatorObj.var], trendDataType);
    } else {
      // Handle multiple var calculations - no instances yet
      return null;
    }
  } else {
    return createCompareDataObject(indicatorObj.calculator, data[indicatorObj.key], trendDataType);
  }
};

export { handleTrendDisplayData };

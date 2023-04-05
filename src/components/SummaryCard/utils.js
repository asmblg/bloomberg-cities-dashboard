import getCurrentAndCompareData from '../../utils/getCurrentAndCompareData';
import formatValue from '../../utils/formatValue';

const handleSummaryData = (config, data, trendDataType) => {
  const { currentValue, compareValue, currentDate, compareDate } = getCurrentAndCompareData(
    config.calculator,
    data,
    trendDataType
  );

  const summaryDataObj = {
    currentValue,
    currentDate,
    compareDate,
    compareValue
  };

  // Handle compare calculations
  switch (config.calculator) {
    case 'differenceFromPrevious': {
      if (summaryDataObj.currentValue && summaryDataObj.compareValue) {
        summaryDataObj.displayValue =
          parseFloat(summaryDataObj.currentValue) - parseFloat(summaryDataObj.compareValue);
      }
      break;
    }
    default: {
      summaryDataObj.displayValue = summaryDataObj.currentValue;
      break;
    }
  }

  summaryDataObj.displayValue = formatValue(summaryDataObj.displayValue, config.formatter);
  return summaryDataObj;
};

export { handleSummaryData };

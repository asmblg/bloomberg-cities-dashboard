import getCurrentAndCompareData from '../../utils/getCurrentAndCompareData';
import formatValue from '../../utils/formatValue';

const handleSummaryData = (config, data, trendDataType) => {
  const { currentValue, compareValue, currentDate, compareDate } = getCurrentAndCompareData(
    config,
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
  switch (config.valueCalculation) {
    case 'differenceFromPrevious': {
      if (summaryDataObj.currentValue) {
        summaryDataObj.displayValue = summaryDataObj.compareValue
          ? parseFloat(summaryDataObj.currentValue) - parseFloat(summaryDataObj.compareValue)
          : null;
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

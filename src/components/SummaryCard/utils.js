import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
import calculateTrend from '../../utils/calculateTrend';
import formatNumberWithCommas from '../../utils/formatNumberWithCommas';

const handleSummaryData = (config, data) => {
  const dateKeys = Object.keys(data);
  const [mostRecentDate, previousDate] = getRecentQuarterEndDates(dateKeys, 2);

  const valuesObj = {};

  if (config.valueCalculation === 'differenceFrom100') {
    valuesObj.mostRecent = mostRecentDate ? 100 - parseFloat(data[mostRecentDate]) : null;
    valuesObj.previous = previousDate ? 100 - parseFloat(data[previousDate]) : null;
  } else {
    valuesObj.mostRecent = mostRecentDate ? data[mostRecentDate] : null;
    valuesObj.previous = previousDate ? data[previousDate] : null;
  }

  const { trendValue, trendDirection } = calculateTrend(
    valuesObj.mostRecent,
    valuesObj.previous,
    config.trendUnits
  );

  const summaryDataObj = {
    trendTextValue: trendValue,
    trendDirection
  };

  switch (config.valueCalculation) {
    case 'difference': {
      const val = parseFloat(valuesObj.mostRecent) - parseFloat(valuesObj.previous);
      summaryDataObj.value = formatNumberWithCommas(val);
      break;
    }
    case 'differenceFrom100': {
      summaryDataObj.value = `${formatNumberWithCommas(valuesObj.mostRecent)}%`;
      break;
    }
    default: {
      summaryDataObj.value = formatNumberWithCommas(valuesObj.mostRecent);
      break;
    }
  }

  return summaryDataObj;
};

export { handleSummaryData };

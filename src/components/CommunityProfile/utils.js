import getMostRecentDateKeys from '../../utils/getMostRecentDateKeys';
import handleIndicatorValueCalculation from '../../utils/handleIndicatorValueCalculation';
import formatIndicatorLabel from '../../utils/formatIndicatorLabel';
import formatNumberWithCommas from '../../utils/formatNumberWithCommas';

const handleValueCalculationAndFormatting = ({ allData, key, indicatorConfig }) => {
  if (allData) {
    const indicatorData = allData[key] || null;
    const mostRecentDates = indicatorData
      ? getMostRecentDateKeys(Object.keys(indicatorData), 1)
      : null;
    const num = mostRecentDates && mostRecentDates[0] ? indicatorData[mostRecentDates] : null;
    // Checks for indicator calculation in manifest
    let value = indicatorConfig.calculation
      ? handleIndicatorValueCalculation({ config: indicatorConfig.calculation, data: allData })
      : num;
    // Add commas to numbers 1000 and over
    value = formatNumberWithCommas(value);
    // Format Label
    if (value && indicatorConfig.labelFormatter) {
      value = formatIndicatorLabel({ formatter: indicatorConfig.labelFormatter, value });
    }
    return value || '-';
  }
  return '-';
};

const handleDonutDataArray = (indicators, data, colors) => {
  const colorMap = indicators.length <= colors.length ? colors : null;

  if (colorMap) {
    const dataArray = indicators.map(({ dataKey, short_name, calculation }, i) => {
      const obj = {
        name: short_name || '',
        color: colors[i]
      };

      const mostRecentDates = data[dataKey] ? getMostRecentDateKeys(Object.keys(data[dataKey]), 1) : null;
      let value = mostRecentDates && mostRecentDates[0] ? parseFloat(data[dataKey][mostRecentDates[0]]) : null;

      if (calculation) {
        value = handleIndicatorValueCalculation({ config: calculation, data });
      }
      obj.value = value;
      return obj;
    });
    return dataArray;
  }
  return null;
};

export { handleValueCalculationAndFormatting, handleDonutDataArray };

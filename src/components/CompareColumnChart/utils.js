import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
import addCalculatedIndicatorToDataObj from '../../utils/addCalculatedIndicatorToDataObj';
import sortDatesArray from '../../utils/sortDatesArray';
import dateToQuarter from '../../utils/dateToQuarter';

const handleDataArray = async ({
  data,
  selectedIndicator,
  mainColumnKey,
  allColumnsArray,
  dataLength
}) => {
  try {
    const obj = {};

    allColumnsArray.forEach(({ key: cityKey }) => {
      if (cityKey && cityKey !== 'default') {
        obj[cityKey] = {};
        if (data[cityKey]?.[selectedIndicator.key] && typeof selectedIndicator.var === 'string') {
          const dataObj = data[cityKey]?.[selectedIndicator.key];
          const dateKeys = getRecentQuarterEndDates(Object.keys(dataObj), dataLength);

          dateKeys.forEach((date, i) => {
            if (i !== dateKeys.length - 1) {
              const currentValue = dataObj[date];
              const compareValue = dataObj[dateKeys[i + 1]];
              const difference = parseFloat(currentValue) - parseFloat(compareValue);
              const value =
                selectedIndicator.postCalculator &&
                selectedIndicator.postCalculator === 'intToThousands'
                  ? Number(difference / 1000).toFixed(1)
                  : difference.toFixed(1);

              obj[cityKey][date] = Number(value);
            }
          });
        } else if (
          (data[cityKey][selectedIndicator.var[0]] || data[cityKey][selectedIndicator.var[1]]) &&
          typeof selectedIndicator.var !== 'string'
        ) {
          const firstVarDataObj =
            data[cityKey][selectedIndicator.var[0]] || data[cityKey][selectedIndicator.var[1]];
          const dateKeys = getRecentQuarterEndDates(Object.keys(firstVarDataObj));

          dateKeys.forEach((date, i) => {
            if (i !== dateKeys.length - 1) {
              const tempDataObj = {};
              selectedIndicator.var.forEach(variable => {
                const currentValue = data[cityKey][variable]?.[date] || null;
                const compareValue = data[cityKey][variable]?.[dateKeys[i + 1]] || null;
                const difference = parseFloat(currentValue || 0) - parseFloat(compareValue || 0);

                tempDataObj[variable] = difference.toFixed(1);
              });
              const newObj = addCalculatedIndicatorToDataObj(selectedIndicator, tempDataObj);
              const value = parseFloat(newObj[selectedIndicator.key]).toFixed(1);

              obj[cityKey][date] = Number(value);
            }
          });
        }
      }
    });

    const sortedDateKeys = sortDatesArray(Object.keys(obj[mainColumnKey]), 'ascending');
    const dataArr = sortedDateKeys.map(dateKey => {
      const chartObj = {};
      chartObj.name = dateToQuarter(dateKey, 'QX YYYY');

      Object.keys(obj).forEach(cityKey => {
        chartObj[cityKey] = obj[cityKey][dateKey];
      });
      return chartObj;
    });
    return dataArr;
  } catch (err) {
    return null;
  }
};

export { handleDataArray };

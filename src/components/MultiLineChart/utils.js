import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
import addCalculatedIndicatorToDataObj from '../../utils/addCalculatedIndicatorToDataObj';
import sortDatesArray from '../../utils/sortDatesArray';
import dateToQuarter from '../../utils/dateToQuarter';

const handleDataArray = async ({
  data,
  selectedIndicator,
  allCitiesArray,
  projectCityKey,
  dataLength
}) => {
  try {
    const obj = {};

    allCitiesArray.forEach(cityKey => {
      if (cityKey && cityKey !== 'default') {
        obj[cityKey] = {};
        if (data[cityKey]?.[selectedIndicator.key] && typeof selectedIndicator.var === 'string') {
          const dataObj = data[cityKey]?.[selectedIndicator.key];
          const dateKeys = getRecentQuarterEndDates(Object.keys(dataObj), dataLength);

          dateKeys.forEach((date, i) => {
            if (i !== dateKeys.length - 1 && selectedIndicator.calculator) {
              const currentValue = dataObj[date];
              const compareValue = dataObj[dateKeys[i + 1]];
              const difference = parseFloat(currentValue) - parseFloat(compareValue);
              const value =
                selectedIndicator.postCalculator &&
                selectedIndicator.postCalculator === 'intToThousands'
                  ? Number(difference / 1000).toFixed(1)
                  : difference;

              obj[cityKey][date] = Number(value);
            } else if (!selectedIndicator.calculator) {
              obj[cityKey][date] = Number(dataObj[date]);
            }
          });
        } else if (
          (data[cityKey][selectedIndicator.var[0]] || data[cityKey][selectedIndicator.var[1]]) &&
          typeof selectedIndicator.var !== 'string' &&
          selectedIndicator.calculator
        ) {
          const firstVarDataObj =
            data[cityKey][selectedIndicator.var[0]] || data[cityKey][selectedIndicator.var[1]];
          const dateKeys = getRecentQuarterEndDates(Object.keys(firstVarDataObj));

          dateKeys.forEach((date, i) => {
            if (i !== dateKeys.length - 1) {
              const tempDataObj = {};
              selectedIndicator.var.forEach(variable => {
                const currentValue = data[cityKey][variable]?.[date] || null;
                const value =
                  currentValue &&
                  selectedIndicator.preCalculator &&
                  selectedIndicator.preCalculator === 'intToThousands' &&
                  variable === 'total'
                    ? parseFloat(currentValue / 1000).toFixed(1)
                    : currentValue
                      ? parseFloat(currentValue).toFixed(1)
                      : null;
                tempDataObj[variable] = Number(value) || null;
              });

              const newObj = addCalculatedIndicatorToDataObj(selectedIndicator, tempDataObj);
              const value = parseFloat(newObj[selectedIndicator.key]).toFixed(1);
              obj[cityKey][date] = Number(value);
            }
          });
        }
      }
    });

    const sortedDateKeys = sortDatesArray(Object.keys(obj[projectCityKey]), 'ascending');
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

const handleLineStyle = ({
  lineKey,
  selectedCityKey,
  projectCityKey,
  projectColor,
  compareColor,
  otherColor
}) => {
  // set to non selected / non project city as default
  const obj = {
    stroke: otherColor || 'gray',
    strokeWidth: 1,
    zIndex: 1
  };

  if (lineKey === projectCityKey) {
    obj.stroke = projectColor || 'blue';
    obj.strokeWidth = 3;
    obj.zIndex = 3;
  }
  if (lineKey === selectedCityKey) {
    obj.stroke = compareColor || 'green';
    obj.strokeWidth = 3;
    obj.zIndex = 2;
  }

  return obj;
};

export { handleDataArray, handleLineStyle };

import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
import addCalculatedIndicatorToDataObj from '../../utils/addCalculatedIndicatorToDataObj';
import sortDatesArray from '../../utils/sortDatesArray';
import dateToQuarter from '../../utils/dateToQuarter';

const handleDataArray = async ({
  data,
  selectedIndicator,
  allLinesArray,
  mainLineKey,
  dataLength
}) => {
  try {
    const obj = {};
    allLinesArray.forEach(lineKey => {
      if (lineKey && lineKey !== 'default') {
        obj[lineKey] = {};
        if (data[lineKey]?.[selectedIndicator.key] && typeof selectedIndicator.var === 'string') {
          const dataObj = data[lineKey]?.[selectedIndicator.key];
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

              obj[lineKey][date] = Number(value);
            } else if (!selectedIndicator.calculator) {
              obj[lineKey][date] = selectedIndicator.units === 'dollars' && dataObj[date].includes('$')
                ? parseFloat(dataObj[date].replace('$', ''))
                : parseFloat(dataObj[date]);
            }
          });
        } else if (selectedIndicator.calculator) {

          const firstVarDataObj = typeof selectedIndicator.var !== 'string' && (data[lineKey][selectedIndicator.var[0]] || data[lineKey][selectedIndicator.var[1]])
            ? data[lineKey][selectedIndicator.var[0]] || data[lineKey][selectedIndicator.var[1]]
            : data[lineKey][selectedIndicator.var];

          const dateKeys = getRecentQuarterEndDates(Object.keys(firstVarDataObj));

          dateKeys.forEach((date, i) => {
            if (i !== dateKeys.length - 1) {
              const tempDataObj = {};
              if (typeof selectedIndicator.var !== 'string') {
                selectedIndicator.var.forEach(variable => {
                  const currentValue = data[lineKey][variable]?.[date] || null;
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
              } else {
                tempDataObj[selectedIndicator.var] = data[lineKey][selectedIndicator.var][date];
              }
              const newObj = addCalculatedIndicatorToDataObj(selectedIndicator, tempDataObj);
              const value = parseFloat(newObj[selectedIndicator.key]).toFixed(1);
              obj[lineKey][date] = Number(value);
            }
          });
        }
      }
    });

    const sortedDateKeys = mainLineKey ? sortDatesArray(Object.keys(obj[mainLineKey]), 'ascending') : null;
    const dataArr = sortedDateKeys ? sortedDateKeys.map(dateKey => {
      const chartObj = {};
      chartObj.name = dateToQuarter(dateKey, 'QX YYYY');

      Object.keys(obj).forEach(lineKey => {
        chartObj[lineKey] = obj[lineKey][dateKey];
      });
      return chartObj;
    }) : [];

    return dataArr;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const handleLineStyle = ({
  lineKey,
  selectedLineKey,
  mainLineKey,
  mainColor,
  compareColor,
  otherColor
}) => {
  // set to non selected / non project city as default
  const obj = {
    stroke: otherColor || 'gray',
    strokeWidth: 1,
    zIndex: 1
  };

  if (lineKey === mainLineKey || (!mainLineKey && lineKey === selectedLineKey)) {
    obj.stroke = mainColor || 'purple';
    obj.strokeWidth = 3;
    obj.zIndex = 3;
  }
  if (mainLineKey && lineKey === selectedLineKey) {
    obj.stroke = compareColor || 'green';
    obj.strokeWidth = 3;
    obj.zIndex = 2;
  }

  return obj;
};

export { handleDataArray, handleLineStyle };

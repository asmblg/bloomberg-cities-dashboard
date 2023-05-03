import getDataCompareDates from './getDataCompareDates';
import moment from 'moment';
/**
 *
 * @param {object} config
 * @param {object} data
 * @param {string} trendDataType 'YtY' or 'QtQ'
 * @returns {object} { currentValue, compareValue, currentDate, compareDate }
 */

const getCurrentAndCompareData = (calculator, data, trendDataType, filterArray) => {
  const dataObj = {
    currentValue: null,
    compareValue: null,
    currentDate: null,
    compareDate: null
  };

  const aggQuarterly = true;

  const aggregationCalculators = [
    'differenceOfTotalsFromPrevious',
    'differenceOfAveragesFromPrevious'
  ];

  if (data) {
    const dateKeys = aggregationCalculators.includes(calculator)
      ? [
        ...new Set(
          Object.entries(data)
            .filter(([key]) => (filterArray ? filterArray.includes(key) : true))
            .map(([, obj]) => Object.keys(obj))
            .flat(1)
        )
      ]
      : calculator === 'differenceFromPrevious'
        ? Object.keys(data).filter(key => (filterArray ? filterArray.includes(key) : true))
        : Object.keys(data);

    // Uses trend type to return two dates (keys) to compare in data object
    const { currentDate, compareDate } = getDataCompareDates(dateKeys, trendDataType);
    dataObj.currentDate = currentDate;
    dataObj.compareDate = compareDate;

    // Handles calculations needed on values before comparing two values
    switch (calculator) {
      case 'differenceFrom100': {
        dataObj.currentValue = currentDate ? 100 - parseFloat(data[currentDate]) : null;
        dataObj.compareValue = compareDate ? 100 - parseFloat(data[compareDate]) : null;
        break;
      }
      case 'differenceOfTotalsFromPrevious': {
        if (currentDate) {
          // console.log(currentDate);
          dataObj.currentValue = 0;
          Object.entries(data)
            .filter(([key]) => (filterArray ? filterArray.includes(key) : true))
            .forEach(([, obj]) => {
              dataObj.currentValue += obj[moment(currentDate).format('YYYY-M-D')] || 0;
              if (aggQuarterly) {
                dataObj.currentValue +=
                  obj[moment(currentDate).subtract(1, 'month').format('YYYY-M-D')] || 0;
                dataObj.currentValue +=
                  obj[moment(currentDate).subtract(2, 'month').format('YYYY-M-D')] || 0;
                dataObj.currentDate = `${moment(currentDate).year()}-Q${moment(
                  currentDate
                ).quarter()}`;
              }
            });
        }
        if (compareDate) {
          console.log(compareDate);
          dataObj.compareValue = 0;
          Object.entries(data)
            .filter(([key]) => (filterArray ? filterArray.includes(key) : true))
            .forEach(([, obj]) => {
              dataObj.compareValue += obj[moment(compareDate).format('YYYY-M-D')] || 0;
              if (aggQuarterly) {
                dataObj.compareValue +=
                  obj[moment(compareDate).subtract(1, 'month').format('YYYY-M-D')] || 0;
                dataObj.compareValue +=
                  obj[moment(compareDate).subtract(2, 'month').format('YYYY-M-D')] || 0;
                dataObj.compareDate = `${moment(compareDate).year()}-Q${moment(
                  compareDate
                ).quarter()}`;
              }
            });
        }
        console.log(dataObj);
        break;
      }
      case 'differenceOfAveragesFromPrevious': {
        if (currentDate) {
          // console.log(currentDate);
          // dataObj.currentValue = null;
          const valueArray = [];
          Object.entries(data)
            .filter(([key]) => (filterArray ? filterArray.includes(key) : true))
            .forEach(([, obj]) => {
              valueArray.push(obj[currentDate] || 0);
              valueArray.push(
                obj[moment(currentDate).subtract(1, 'month').format('YYYY-M-D')] || 0
              );
              valueArray.push(
                obj[moment(currentDate).subtract(2, 'month').format('YYYY-M-D')] || 0
              );
              const calcArray = valueArray.map(value => parseInt(value)).filter(value => value > 0);
              dataObj.currentValue = calcArray[0]
                ? calcArray.reduce((a, b) => a + b, 0) / calcArray.length
                : null;
              dataObj.currentDate = `${moment(currentDate).year()}-Q${moment(
                currentDate
              ).quarter()}`;
            });
        }
        if (compareDate) {
          const valueArray = [];
          Object.entries(data)
            .filter(([key]) => (filterArray ? filterArray.includes(key) : true))
            .forEach(([, obj]) => {
              valueArray.push(obj[compareDate] || 0);
              valueArray.push(
                obj[moment(compareDate).subtract(1, 'month').format('YYYY-M-D')] || 0
              );
              valueArray.push(
                obj[moment(compareDate).subtract(2, 'month').format('YYYY-M-D')] || 0
              );
              const calcArray = valueArray.map(value => parseInt(value)).filter(value => value > 0);
              dataObj.compareValue = calcArray[0]
                ? calcArray.reduce((a, b) => a + b, 0) / calcArray.length
                : null;
              dataObj.compareDate = `${moment(compareDate).year()}-Q${moment(
                compareDate
              ).quarter()}`;
            });
        }
        break;
      }
      case 'differenceFromPrevious': {
        dataObj.currentValue = calcDifferenceOfTotalFromPrevQtr(data, currentDate);
        dataObj.compareValue = calcDifferenceOfTotalFromPrevQtr(data, compareDate);
        break;
      }
      default: {
        dataObj.currentValue = currentDate ? data[currentDate] : null;
        dataObj.compareValue = compareDate ? data[compareDate] : null;
        break;
      }
    }
  }
  // console.log(dataObj);
  return dataObj;
};

function calcDifferenceOfTotalFromPrevQtr(data, date) {
  const prevQtrKeyFromDate = date
    ? moment(date, 'YYYY-MM-D').subtract(3, 'month').format('YYYY-MM-D')
    : null;

  const value = prevQtrKeyFromDate
    ? data[prevQtrKeyFromDate]
      ? data[date] - data[prevQtrKeyFromDate]
      : data[date]
    : null;
  
  return value;
}

export default getCurrentAndCompareData;

import getDataCompareDates from './getDataCompareDates';
import moment from 'moment';
import padDate from './padDate';

/**
 *
 * @param {object} config
 * @param {object} data
 * @param {string} trendDataType 'YtY' or 'QtQ'
 * @returns {object} { currentValue, compareValue, currentDate, compareDate }
 */

const getCurrentAndCompareData = (calculator, data, trendDataType, filterArray, postCalculator) => {
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
            .map(([, obj]) => 
              Object.keys(obj)
              // .map(key => 
              //   key.match(/-/) ?
              //     padDate(key)
              //     : key
              // )
            )
            .flat(1)
        )
      ]
      : calculator === 'differenceFromPrevious'
        ? Object.keys(data)
          .filter(key => (filterArray ? filterArray.includes(key) : true))
          // .map(key => 
          //   key.match(/-/) ?
          //     padDate(key)
          //     : key
          // )
        : Object.keys(data);
      // .map(key => 
      //   key.match(/-/) ?
      //     padDate(key)
      //     : key
      // );

    // Uses trend type to return two dates (keys) to compare in data object
    const { currentDate, compareDate } = getDataCompareDates(dateKeys, trendDataType);
    dataObj.currentDate = currentDate;
    dataObj.compareDate = compareDate;

    // console.log(dataObj);

    // Handles calculations needed on values before comparing two values
    switch (calculator) {
      case 'differenceFrom100': {
        dataObj.currentValue = currentDate ? 100 - parseFloat(data[currentDate]) : null;
        dataObj.compareValue = compareDate ? 100 - parseFloat(data[compareDate]) : null;
        break;
      }
      case 'differenceOfTotalsFromPrevious': {
        if (currentDate) {
          const dateString = padDate(currentDate);
          dataObj.currentValue = 0;
          Object.entries(data)
            .filter(([key]) => (filterArray ? filterArray.includes(key) : true))
            .forEach(([, obj]) => {
              dataObj.currentValue += obj[moment(dateString).utc().format('YYYY-M-D')] || 0;
              if (aggQuarterly) {
                dataObj.currentValue +=
                  obj[moment(dateString).utc().subtract(1, 'month').format('YYYY-M-D')] || 0;
                dataObj.currentValue +=
                  obj[moment(dateString).utc().subtract(2, 'month').format('YYYY-M-D')] || 0;
                dataObj.currentDate = `${moment(dateString).utc().year()}-Q${moment(
                  dateString
                ).utc().quarter()}`;
              }
            });
        }
        if (compareDate) {
          const dateString = padDate(compareDate);
          dataObj.compareValue = 0;
          Object.entries(data)
            .filter(([key]) => (filterArray ? filterArray.includes(key) : true))
            .forEach(([, obj]) => {
              dataObj.compareValue += obj[moment(dateString).utc().format('YYYY-M-D')] || 0;
              if (aggQuarterly) {
                dataObj.compareValue +=
                  obj[moment(dateString).utc().subtract(1, 'month').format('YYYY-M-D')] || 0;
                dataObj.compareValue +=
                  obj[moment(dateString).utc().subtract(2, 'month').format('YYYY-M-D')] || 0;
                dataObj.compareDate = `${moment(dateString).utc().year()}-Q${moment(
                  dateString
                ).utc().quarter()}`;
              }
            });
        }
        break;
      }
      case 'differenceOfAveragesFromPrevious': {
        if (currentDate) {
          const dateString = padDate(currentDate);
          const valueArray = [];
          Object.entries(data)
            .filter(([key]) => (filterArray ? filterArray.includes(key) : true))
            .forEach(([, obj]) => {
              valueArray.push(obj[currentDate] || 0);
              valueArray.push(
                obj[moment(dateString).utc().subtract(1, 'month').format('YYYY-M-D')] || 0
              );
              valueArray.push(
                obj[moment(dateString).utc().subtract(2, 'month').format('YYYY-M-D')] || 0
              );
              const calcArray = valueArray.map(value => parseInt(value)).filter(value => value > 0);
              dataObj.currentValue = calcArray[0]
                ? calcArray.reduce((a, b) => a + b, 0) / calcArray.length
                : null;
              dataObj.currentDate = `${moment(dateString).utc().year()}-Q${moment(
                dateString
              ).utc().quarter()}`;
            });
        }
        if (compareDate) {
          const dateString = padDate(compareDate);
          const valueArray = [];
          Object.entries(data)
            .filter(([key]) => (filterArray ? filterArray.includes(key) : true))
            .forEach(([, obj]) => {
              valueArray.push(obj[compareDate] || 0);
              valueArray.push(
                obj[moment(dateString).utc().subtract(1, 'month').format('YYYY-M-D')] || 0
              );
              valueArray.push(
                obj[moment(dateString).utc().subtract(2, 'month').format('YYYY-M-D')] || 0
              );
              const calcArray = valueArray.map(value => parseInt(value)).filter(value => value > 0);
              dataObj.compareValue = calcArray[0]
                ? calcArray.reduce((a, b) => a + b, 0) / calcArray.length
                : null;
              dataObj.compareDate = `${moment(dateString).utc().year()}-Q${moment(
                dateString
              ).utc().quarter()}`;
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

  if (postCalculator === 'percentChange') {
    console.log(dataObj);
    const calculatedCurrent = 100* ((dataObj.currentValue - dataObj.compareValue)/dataObj.compareValue);
    return {
      ...dataObj,
      compareValue: null,
      currentValue: calculatedCurrent
    };

  }
  // console.log(dataObj);
  return dataObj;
};

function calcDifferenceOfTotalFromPrevQtr(data, date) {
  const prevQtrKeyFromDate = date
    ? moment(date, 'YYYY-MM-D').utc().subtract(3, 'month').format('YYYY-MM-D')
    : null;

  const value = prevQtrKeyFromDate
    ? data[prevQtrKeyFromDate]
      ? data[date] - data[prevQtrKeyFromDate]
      : data[date]
    : null;
  
  return value;
}

export default getCurrentAndCompareData;

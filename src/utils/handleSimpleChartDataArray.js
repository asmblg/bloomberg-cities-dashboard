
import moment from 'moment';
import getRecentQuarterEndDates from './getRecentQuarterEndDates';
import sortDatesArray from './sortDatesArray';
import getNestedValue from './getNestedValue';
import padDate from './padDate';

const handleSimpleChartDataArray = (config, data) => {
  if (config?.values?.calculator === 'total') {
    const dataArray = [];
    const dataObj = {};
    Object.entries(data)
      .filter(([key,]) => config?.values.filter ? config?.values.filter.includes(key) : true)
      .forEach(([, values]) => {
        Object.entries(values).forEach(([key, nestedValue]) => {
          const dateKey = getQuarterDateKey(key);

          if (!isNaN(parseInt(nestedValue))) {
            if (config?.values.average) {
              if (!dataObj[dateKey]) {
                dataObj[dateKey] = [parseInt(nestedValue)];
              } else {
                dataObj[dateKey].push(parseInt(nestedValue));
              }
            } else if (!dataObj[dateKey]) {
              dataObj[dateKey] = parseInt(nestedValue);
            } else {
              dataObj[dateKey] += parseInt(nestedValue);
            }
          }
        });
      });

    Object.entries(dataObj)
      .forEach(([key, value]) => {
        const formattedObj = {};
        formattedObj.name = key;
        if (config?.average) {
          formattedObj[config?.calculator] = value[0] ?
            value.reduce((a, b) =>
              a + b, 0) / value.length
            : null;
        } else {
          formattedObj.value = value;
        }
        dataArray.push(formattedObj);
      });

    // Sort by Name 
    return dataArray.sort((a, b) =>
      parseInt(a.name.replace('-Q', '')) - parseInt(b.name.replace('-Q', ''))
    );

  } 
  else {
    const dataObj = config.dataPath ? getNestedValue(data, config.dataPath) : data;
    const quarterDateKeys = dataObj ? getRecentQuarterEndDates(Object.keys(dataObj), config.dataLength) : null;
    
    if (quarterDateKeys && quarterDateKeys[0]) {
      const sortedDates = sortDatesArray(quarterDateKeys, 'ascending');
      const dataArray = sortedDates.map((key, i) => {
        const obj = {};
        obj.name = key;

        const calculator = config.values?.calculator || config.indicator?.calculator;

        switch (calculator) {
          case 'differenceFromPrevious': {
            const compareKey = i !== 0 ? sortedDates[i - 1] : null;

            if (compareKey) {
              const value = parseInt(dataObj[key]) - parseInt(dataObj[compareKey]);
              obj.value = value;
            }
            break;
          }
          default: {
            if (!config.stacked) {
              obj.value = dataObj[key];
            } else {
              Object.entries(dataObj[key]).forEach(([k, v]) => {
                if (v && v !== 0) {
                  obj[k] = v;
                }
              });
            }
          }
        }
        return obj;
      });
      return dataArray;
    }
  }
};

function getQuarterDateKey(key) {
  let date = new Date(key);
  if (Object.prototype.toString.call(date) === '[object Date]') {
    if (isNaN(date)) {
      date = new Date(padDate(key));
    }
  }
  const year = moment(date.getTime()).utc().year();
  const quarter = moment(date.getTime()).utc().quarter();
  return `${year}-Q${quarter}`;
}

export default handleSimpleChartDataArray;

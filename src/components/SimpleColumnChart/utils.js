import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
import sortDatesArray from '../../utils/sortDatesArray';
import getNestedValue from '../../utils/getNestedValue';
import padDate from '../../utils/padDate';
import moment from 'moment';


const getQuarterDateKey = key => {
  let date = new Date(key);
  if (Object.prototype.toString.call(date) === '[object Date]') {
    if (isNaN(date)) {
      date = new Date(padDate(key));
    }
  }
  const year = moment(date.getTime()).utc().year();
  const quarter = moment(date.getTime()).utc().quarter();
  return `${year}-Q${quarter}`;
};

const handleData = (config, data) => {
  if (config?.values?.calculator === 'total') {
    const dataArray = [];
    const dataObj = {};
    Object.entries(data)
      .filter(([key,]) => config?.values.filter ? config?.values.filter.includes(key): true)
      .forEach(([,values]) => {
        Object.entries(values).forEach(([key, nestedValue]) => {

          const dateKey = getQuarterDateKey(key);

          if (!isNaN(parseInt(nestedValue))) {
            if (config?.values.average){
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
    // console.log(dataObj);
    Object.entries(dataObj)
      .forEach(([key, value]) => {
        const formattedObj = {};
        formattedObj.name = key;
        if (config?.average) {
          formattedObj[config?.calculator] = value[0] ? 
            value.reduce((a,b) => 
              a + b, 0)/value.length 
            : null;
        } else {
          formattedObj.value = value;
        }
        dataArray.push(formattedObj);
      });

    return dataArray;

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
            obj.value = dataObj[key];
          }
        }
        return obj;
      });
      return dataArray;
    }
  }
};

export { handleData };

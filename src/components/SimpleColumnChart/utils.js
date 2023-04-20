import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
import sortDatesArray from '../../utils/sortDatesArray';
import getNestedValue from '../../utils/getNestedValue';

const handleData = (config, data) => {
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
};

export { handleData };

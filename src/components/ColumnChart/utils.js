import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
import sortDatesArray from '../../utils/sortDatesArray';

const handleData = (config, data) => {
  const quarterDateKeys = getRecentQuarterEndDates(Object.keys(data), config.dataLength);
  

  if (quarterDateKeys && quarterDateKeys[0]) {
    const sortedDates = sortDatesArray(quarterDateKeys, 'ascending');
    const dataArray = sortedDates.map((key, i) => {
      const obj = {};
      obj.name = key;

      switch (config.values.calculator) {
        case 'differenceFromPrevious': {
          const compareKey = i !== 0 ? sortedDates[i - 1] : null;

          if (compareKey) {
            const value = parseInt(data[key]) - parseInt(data[compareKey]);
            obj.value = value;
          }
          break;
        }
        default: {
          obj.value = data[key];
        }
      }
      

      return obj;
    });
    return dataArray;
  }
};

export { handleData };

import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
import sortDatesArray from '../../utils/sortDatesArray';

const handleData = (config, data) => {
  const quarterDateKeys = getRecentQuarterEndDates(Object.keys(data), config.dataLength);

  if (quarterDateKeys && quarterDateKeys[0]) {
    const dataArray = sortDatesArray(quarterDateKeys, 'ascending').map(key => {
      const obj = {};
      obj.name = key;
      obj.value = data[key];

      return obj;
    });
    return dataArray;
  }
};

export { handleData };

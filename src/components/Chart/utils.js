import moment from 'moment';

import getMostRecentDateKeys from '../../utils/getMostRecentDateKeys';
import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';
import sortDatesArray from '../../utils/sortDatesArray';
import abbreviateNumber from '../../utils/abbreviateNumber';

const getDateKeysForChart = (config, data) => {
  const dateKeys = Object.keys(data);
  // Pull in how many dates are wanted from config. If nothing is present in config, all dates in object will be used
  const dataArrayLength = config.dataLength ? config.dataLength : 12;

  const keys =
    config.dataFormatter === 'monthToQuarter'
      ? getRecentQuarterEndDates(dateKeys, dataArrayLength)
      : getMostRecentDateKeys(dateKeys, dataArrayLength);

  return keys && keys[0] ? sortDatesArray(keys, 'ascending') : [];
};

const handleDataArray = {
  line: (config, data) => {
    const dataKeys = getDateKeysForChart(config, data);

    const dataArray = dataKeys.map(key => ({
      name: key,
      value: data[key]
    }));

    return dataArray;
  },
  donut: (config, data) => {
    if (config.valueType === 'single-percentage') {
      const numValue = parseFloat(data.value);

      const dataArray = [
        {
          name: 'percentage',
          value: numValue,
          fillColor: config.color || 'black'
        },
        {
          name: 'percentage',
          value: 100 - numValue,
          fillColor: config.accentColor || 'gray'
        }
      ];
      return dataArray;
    }
    // HANDLE COMMUNITY OTHER DONUTS
    return null;
  },
  column: (config, data) => {
    console.log(config, data);
    return null;
  },
  horizontalBar: (config, data) => {
    console.log(config, data);
    return null;
  }
};

const labelFormatter = {
  monthToQuarter: date => {
    const dateObj = moment(date, 'YYYY-MM-DD');
    const quarter = dateObj.quarter();
    const year = dateObj.format('YY');

    return `Q${quarter}-${year}`;
  },
  formatQuarter: str => {
    const [year, quarterNum] = str.split('-Q');
    return `Q${quarterNum}-${year.slice(2, 4)}`;
  },
  abbreviateNumber
};

const handleLabelFormatter = (functionName, str) => {
  if (functionName && labelFormatter[functionName] && str) {
    return labelFormatter[functionName](str);
  }
  return str;
};

export { handleDataArray, handleLabelFormatter };

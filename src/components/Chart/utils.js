import moment from 'moment';

import getMostRecentDateKeys from '../../utils/getMostRecentDateKeys';
import sortDatesArray from '../../utils/sortDatesArray';

const dataArrayHandler = {
  line: (config, data) => {
    const dateKeys = Object.keys(data);
    const dataArrayLength =
      config.dateType === 'month' ? 12 : config.dateType === 'quarter' ? 4 : null;
    
    const dataKeys = getMostRecentDateKeys(dateKeys, dataArrayLength);
    const sortedArray = sortDatesArray(dataKeys, 'ascending').map(date => ({
      name: date,
      value: data[date]
    }));
    // Calculation: Comparing current value to previous value to determine the difference between the two
    // Need clarification if this is the calculation needed for this specific line chart
    // First use: Jobs added Summary Card
    const dataArray =
      config.valueCalculation === 'difference'
        ? sortedArray.map(({ name, value }, index, array) => {
          if (index === 0) {
            // first iteration, return 0 because no previous value to compare to
            return {
              name: name,
              value: 0
            };
          } else {
            const prevValue = array[index - 1].value;
            // return the difference between current and previous value
            return {
              name: name,
              value: value - prevValue
            };
          }
        })
        : sortedArray;

    return dataArray;
  },
  donut: (config, data) => {
    if (config.valueType === 'single-percentage') {
      const [key, value] = Object.entries(data)[0];
      const numValue = parseFloat(value);

      const dataArray = [
        {
          name: key,
          value: numValue,
          fillColor: config.color || 'black'
        },
        {
          name: key,
          value: 100 - numValue,
          fillColor: config.accentColor || 'gray'
        }
      ];
      return dataArray;
    }
    // HANDLE COMMUNITY PROFILE DONUT
    return null;
  },
  column: (config, data) => {
    console.log(config, data);
    return null;
  }
};

const handleData = (config, data) => {
  if (dataArrayHandler[config.type]) {
    return dataArrayHandler[config.type](config, data);
  } else {
    return null;
  }
};

const labelFormatter = {
  monthToQuarter: date => {
    const quarterNum = moment(date, 'YYYY-MM-DD').quarter();
    const year = `${moment(date, 'YYYY-MM-DD').year()}`.slice(2, 4);
    const formattedDate = `Q${quarterNum}-${year}`;
    return formattedDate;
  },
  abbreviateNumber: num => {
    const number = typeof num === 'string' ? parseInt(num) : num;
    if (number >= 1000000000) {
      return (number / 1000000000).toFixed(1) + 'b';
    }
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'm';
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k';
    }
    return number.toString();
  },
  formatQuarter: str => {
    const [year, quarterNum] = str.split('-Q');
    return `Q${quarterNum}-${year.slice(2, 4)}`;
  }
};

const handleLabelFormatter = (functionName, str) => {
  if (functionName && labelFormatter[functionName] && str) {
    return labelFormatter[functionName](str);
  }
  return str;
};

export { handleData, handleLabelFormatter };

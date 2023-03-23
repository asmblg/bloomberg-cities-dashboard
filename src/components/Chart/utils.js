import moment from 'moment';

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

export { handleLabelFormatter };

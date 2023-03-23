import moment from 'moment';

const labelFormatter = {
  monthToQuarter: date => {
    const formattedDate = `Q${moment(date, 'YYYY-MM-DD').quarter()} ${moment(
      date,
      'YYYY-MM-DD'
    ).year()}`;
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
  }
};

const handleLabelFormatter = (functionName, str) => {
  if (functionName) {
    return labelFormatter[functionName](str);
  }
  return str;
};

export { handleLabelFormatter };

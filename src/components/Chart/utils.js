import moment from 'moment';

function abbreviateNumber(num) {
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

function getQuarterFromDate(date) {
  const jsDate = new Date(date);
  const quarter = moment(jsDate).quarter();
  const year = moment(jsDate).year();

  return `Q${quarter} ${year}`;
}

export { abbreviateNumber, getQuarterFromDate };

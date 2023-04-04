import abbreviateNumber from './abbreviateNumber';
import dateToQuarter from './dateToQuarter';
import formatQuarter from './formatQuarter';

/**
 * 
 * @param {string} text original tick string
 * @param {string} formatter axis label formatter from config 
 * @returns formatted tick
 */

const formatChartTick = (text, formatter) => {
  if (text) {
    switch (formatter) {
      case 'abbreviateNumber': {
        return abbreviateNumber(text);
      }
      case 'longMonthToQuarter': {
        return dateToQuarter(text, 'QX YYYY');
      }
      case 'shortMonthToQuarter': {
        return dateToQuarter(text, 'QX-YY');
      }
      case 'formatQuarter': {
        return formatQuarter(text);
      }
      default: {
        return text;
      }
    }
  }
  return '';
};

export default formatChartTick;

import abbreviateNumber from './abbreviateNumber';
import dateToQuarter from './dateToQuarter';

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
      case 'longQuarter': {
        return dateToQuarter(text, 'QX YYYY');
      }
      case 'shortQuarter': {
        return dateToQuarter(text, 'QX-YY');
      }
      case 'percent': {
        return `${text}%`;
      } 
      default: {
        return text;
      }
    }
  }
  return '';
};

export default formatChartTick;

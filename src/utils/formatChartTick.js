// import abbreviateNumber from './abbreviateNumber';
import dateToQuarter from './dateToQuarter';
import formatValue from './formatValue';

/**
 *
 * @param {string} text original tick string
 * @param {string} formatter axis label formatter from config
 * @returns formatted tick
 */

const formatChartTick = (text, formatter, units) => {
  if (text) {
    switch (formatter) {
      case 'abbreviateNumber': {
        return formatValue(text, 'bigNumbers', true);
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
      case 'formatValue': {
        return formatValue(text, units, true);
      }
      case 'thousands': {
        return formatValue(text, 'thousands', true);
      }
      default: {
        return text;
      }
    }
  }
  return '';
};

export default formatChartTick;

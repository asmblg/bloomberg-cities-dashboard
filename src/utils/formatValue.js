import formatNumberWithCommas from './formatNumberWithCommas';
/**
 *
 * @param {number} value number or string representation of a number
 * @param {*} units units that the value should be returned in
 * @returns {string} Formatted value - all returns will be formatted with commas
 */
const formatValue = (value, units) => {
  if (value) {
    switch (units) {
      case 'percent': {
        return `${formatNumberWithCommas(parseFloat(value).toFixed(1))}%`;
      }
      case 'dollars': {
        return `$${formatNumberWithCommas(parseFloat(`${value}`.replace('$', '')).toFixed(0))}`;
      }
      case 'dollarsAndCents': {
        return `$${formatNumberWithCommas(parseFloat(`${value}`.replace('$', '')).toFixed(2))}`;
      }
      case 'bigDollars': {
        const thousands =  value >= 1000;
        const millions = value >= 1000000;
        const calcValue = millions ?
          parseFloat(value / 1000000).toFixed(1)
          : thousands ?
            parseFloat(value / 1000).toFixed(1)
            : 0;
        const text = parseFloat(calcValue).toFixed(thousands || millions ? 1 : 0).replace('.0', '');
        const unit = millions ? 'M' : thousands ? 'K' : ''; 
        return `$${text}${unit}`;
        
          
      }
      case 'bigNumbers': {
        const thousands =  value >= 1000;
        const millions = value >= 1000000;
        const calcValue = millions ?
          parseFloat(value / 1000000).toFixed(1)
          : thousands ?
            parseFloat(value / 1000).toFixed(1)
            : 0;
        const text = parseFloat(calcValue).toFixed(thousands || millions ? 1 : 0).replace('.0', '');
        const unit = millions ? 'M' : thousands ? 'K' : ''; 
        return thousands ? `${text}${unit}` : value;
      }
      case 'thousands': {
        return `${value}K`;
      }

      default: {
        return `${formatNumberWithCommas(value)}${units ? ` ${units}` : ''}`;
      }
    }
  }
  return '-';
};

export default formatValue;

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
      default: {
        return formatNumberWithCommas(value);
      }
    }
  }
  return '-';
};

export default formatValue;

/**
 * 
 * @param {string} formatter Type of formatter from data manifest
 * @param {string} value Value to format 
 * @returns Formatted value
 */

const formatIndicatorLabel = ({ formatter, value }) => {
  switch (formatter) {
    case 'numToDollars': {
      value = `$${value}.00`;
      break;
    }
    case 'percent': {
      value = `${value}%`;
      break;
    }
    default: {
      break;
    }
  }
  return value;
};

export default formatIndicatorLabel;

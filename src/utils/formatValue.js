import formatNumberWithCommas from './formatNumberWithCommas';
/**
 *
 * @param {number} value number or string representation of a number
 * @param {*} units units that the value should be returned in
 * @returns {string} Formatted value - all returns will be formatted with commas
 */
const formatValue = (value, units, onAxis) => {
  const fixedPointNum = onAxis ? 0 : 1;

  // console.log(value, units, onAxis);
  if (value) {
    switch (units) {
      case 'percent':
      case 'percentage': 
      case 'percentX100': {
        const multiplier = units === 'percentX100' ? 100 : 1;
        return `${formatNumberWithCommas(parseFloat(value * multiplier).toFixed(fixedPointNum))}%`;
      }
      case 'dollars': {
        return `$${formatNumberWithCommas(parseFloat(`${value}`.replace('$', '')).toFixed(0))}`;
      }
      case 'dollarsAndCents': {
        return `$${formatNumberWithCommas(parseFloat(`${value}`.replace('$', '')).toFixed(2))}`;
      }
      case 'bigDollars':
      case 'bigEuros': {  
        const thousands =  Math.abs(value) >= 1000;
        const millions = Math.abs(value) >= 1000000;
        const billions = Math.abs(value) >= 1000000000;

        const calcValue = billions
          ? parseFloat(value / 1000000000).toFixed(fixedPointNum)
          : millions
            ? parseFloat(value / 1000000).toFixed(fixedPointNum)
            : thousands
              ? parseFloat(value / 1000).toFixed(fixedPointNum)
              : 0;

        const text = parseFloat(calcValue).toFixed(thousands || millions ? 1 : 0).replace('.0', '');
        const unit = billions ? 'B' : millions ? 'M' : thousands ? 'K' : ''; 
        return units === 'bigEuros' ? `${text}${unit} €` :`$${text}${unit}`;
        
          
      }
      case 'bigNumbers': {
        const thousands =  Math.abs(value) >= 1000;
        const millions = Math.abs(value) >= 1000000;
        const billions = Math.abs(value) >= 1000000000;

        const calcValue = billions
          ? parseFloat(value / 1000000000).toFixed(fixedPointNum)
          : millions
            ? parseFloat(value / 1000000).toFixed(fixedPointNum)
            : thousands
              ? parseFloat(value / 1000).toFixed(fixedPointNum)
              : 0;

        const text = parseFloat(calcValue).toFixed(thousands || millions ? 1 : 0).replace('.0', '');
        const unit = billions ? 'B' : millions ? 'M' : thousands ? 'K' : ''; 
        return thousands ? `${text}${unit}` : value;
      }
      case 'thousands': {
        return `${(value).toFixed(Math.abs(value) < 1 ? 1 : fixedPointNum)}K`;
      }
      case '€' :
      case 'euro': 
      case 'euros':
      case 'M €':  {
        return `${formatNumberWithCommas(value)}${units === 'M €' ? `${units}` : ' €'}`;
      }

      default: {
        return `${formatNumberWithCommas(value)}${units ? ` ${units}` : ''}`;
      }
    }
  }
  return '-';
};

export default formatValue;

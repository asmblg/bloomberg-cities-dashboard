import formatNumberWithCommas from './formatNumberWithCommas';
/**
 *
 * @param {number} value number or string representation of a number
 * @param {*} units units that the value should be returned in
 * @returns {string} Formatted value - all returns will be formatted with commas
 */
const formatValue = (value, units, onAxis) => {
  const location = typeof window !== 'undefined' ? window.location : null;
  const queryParams = location ? new URLSearchParams(location.search) : null;
  const lng = queryParams ? queryParams.get('lng') : null;
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

        const calcValue = billions && lng !== 'pt'
          ? parseFloat(value / 1000000000).toFixed(fixedPointNum)
          : millions
            ? parseFloat(value / 1000000).toFixed(billions ? 0 : fixedPointNum)
            : thousands
              ? parseFloat(value / 1000).toFixed(fixedPointNum)
              : 0;

        const text = parseFloat(calcValue).toFixed(thousands || millions ? 1 : 0).replace('.0', '');
        const unit = billions && lng !== 'pt' ? 'B' : millions ? 'M' : thousands ? 'K' : ''; 
        return units === 'bigEuros' ? `${formatNumberWithCommas(text)}${unit}€` :`$${formatNumberWithCommas(text)}${unit}`;
        
          
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

        const text = parseFloat(calcValue).toFixed(thousands || millions || billions ? 1 : 0).replace('.0', '');
        const unit = billions ? 'B' : millions ? 'M' : thousands ? 'K' : ''; 
        return thousands ? `${formatNumberWithCommas(text)}${unit}` : formatNumberWithCommas(value);
      }
      case 'thousands': {
        return `${formatNumberWithCommas((value).toFixed(Math.abs(value) < 1 ? 1 : fixedPointNum))}K`;
      }
      case '€' :
      case 'euro': 
      case 'euros':
      case 'M €':  {
        if (units === 'M €' && Math.abs(value) >= 1000) {
          const floatValue = parseFloat(value).toFixed(0);

          if (lng === 'pt') {
            return `${formatNumberWithCommas(floatValue)}M€`;
          }

          const billionsValue = parseFloat(value / 1000).toFixed(1);
          return `${formatNumberWithCommas(billionsValue)}B€`;

        } else {
          const floatValue = parseFloat(value).toFixed(fixedPointNum);

        return `${formatNumberWithCommas(floatValue)}${units === 'M €' ? 'M€' : '€'}`;
        }
      }

      default: {
        return `${formatNumberWithCommas(value)}${units ? ` ${units}` : ''}`;
      }
    }
  }
  return '-';
};

export default formatValue;

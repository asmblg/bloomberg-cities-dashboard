import formatNumberWithCommas from './formatNumberWithCommas';
/**
 *
 * @param {number} value number or string representation of a number
 * @param {*} units units that the value should be returned in
 * @returns {string} Formatted value - all returns will be formatted with commas
 */
const formatValue = (
  value, 
  units, 
  onAxis, 
  totalValue, 
  showZeroValues = true
) => {
  const location = typeof window !== 'undefined' ? window.location : null;
  const queryParams = location ? new URLSearchParams(location.search) : null;
  const lng = queryParams ? queryParams.get('lng') : null;
  const queryNumericFormatRegion = queryParams ? queryParams.get('numericFormatRegion') : null;
  const globalNumericFormatRegion = typeof window !== 'undefined'
    ? window.__numericFormatRegion
    : null;
  const numericFormatRegion = queryNumericFormatRegion || globalNumericFormatRegion || null;
  const numericLocale = lng === 'pt'
    ? 'pt-PT'
    : lng === 'sk' || numericFormatRegion === 'sk'
      ? 'sk-SK'
      : 'en-US';
  const compactLocale = lng === 'pt' || lng === 'sk';
  const fixedPointNum = onAxis ? 0 : 1;

  // console.log('formatValue', value)
  if (
    value || 
    ( showZeroValues && (value === 0 || value === '0') )
  ) {
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
        const thousands = Math.abs(value) >= 1000;
        const millions = Math.abs(value) >= 1000000;
        const billions = Math.abs(value) >= 1000000000;

        const calcValue = billions && !compactLocale
          ? parseFloat(value / 1000000000).toFixed(fixedPointNum)
          : millions
            ? parseFloat(value / 1000000).toFixed(billions ? 0 : fixedPointNum)
            : thousands
              ? parseFloat(value / 1000).toFixed(fixedPointNum)
              : 0;

        const text = parseFloat(calcValue).toFixed(thousands || millions ? 1 : 0).replace('.0', '');
        const unit = billions && !compactLocale
          ? 'B'
          : millions
            ? 'M' : thousands
              ? compactLocale ? 'k' : 'K' : '';
        return units === 'bigEuros' ? `${formatNumberWithCommas(text)}${unit}€` : `$${formatNumberWithCommas(text)}${unit}`;


      }
      case 'bigNumbers': {
        const thousands = Math.abs(value) >= 1000;
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
        const unit = billions ? 'B' : millions ? 'M' : thousands ? (compactLocale ? 'k' : 'K') : '';
        return thousands ? `${formatNumberWithCommas(text)}${unit}` : formatNumberWithCommas(value);
      }
      case 'thousands': {
        return `${formatNumberWithCommas((value).toFixed(Math.abs(value) < 1 ? 1 : fixedPointNum))}K`;
      }
      case '€':
      case '€ per sqm/month':
      case 'euro':
      case 'euros':
      case 'M €':
      case '$M': {
        if (value === 0 && showZeroValues) {
          return '0' + (units === '€ per sqm/month' ? '€ per sqm/month' : '€');
        }
        if ((units === 'M €' || units === '$M') && Math.abs(value) >= 1000) {
          const floatValue = parseFloat(value).toFixed(0);

          if (compactLocale) {
            return `${formatNumberWithCommas(floatValue)}M€`;
          }

          const billionsValue = parseFloat(value / 1000).toFixed(1);
          return `${formatNumberWithCommas(billionsValue)}B€`;

        } else {

          if ((units === 'M €' || units === '$M') && Math.abs(value) < 1) {
            const floatValue = parseFloat(value * 1000).toFixed(1);
            return `${formatNumberWithCommas(floatValue)}K€`;
          }

          const floatValue = parseFloat(value).toFixed(fixedPointNum);
          return `${units === '$M' ? '$' : ''}${formatNumberWithCommas(floatValue)}${units === 'M €' ? 'M€' : units === '€ per sqm/month' ? '€ per sqm/month' : units === '$M' ? 'M' : '€'}`;
        }
      }
      case 'per100000': {
        return `${formatNumberWithCommas(parseFloat(value * 1000).toFixed(0))}`;
      }
      case 'wholeNumbers': {
        return `${value?.toLocaleString(numericLocale, { maximumFractionDigits: 0 })}`;
        // return `${formatNumberWithCommas(parseFloat(value).toFixed(0))}`;
      }

      case 'percentageOfTotal': {
        const percentage = totalValue ? (value / totalValue) * 100 : 0;
        return `${formatNumberWithCommas(percentage.toFixed(fixedPointNum))}%`;
      }

      default: {
        return `${value?.toLocaleString(numericLocale)}${units ? ` ${units}` : ''}`;
      }
    }
  }
  return '-';
};

export default formatValue;

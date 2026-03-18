/**
 *
 * @param {number|string} num Number or string (that represents a number)
 * @returns {string} A number formatted in European style: periods for thousands, commas for decimals
 */
const formatNumberEU = num => {
  const location = typeof window !== 'undefined' ? window.location : null;
  const queryParams = location ? new URLSearchParams(location.search) : null;
  const lng = queryParams ? queryParams.get('lng') : null;
  const queryNumericFormatRegion = queryParams ? queryParams.get('numericFormatRegion') : null;
  const globalNumericFormatRegion = typeof window !== 'undefined'
    ? window.__numericFormatRegion
    : null;
  const numericFormatRegion = queryNumericFormatRegion || globalNumericFormatRegion || null;

  const formatIntWithThousands = (integerStr, separator) => {
    const isNegative = integerStr.startsWith('-');
    const intPart = isNegative ? integerStr.slice(1) : integerStr;
    const chars = intPart.split('');

    if (chars.length > 3) {
      chars.reverse();
      for (let i = 3; i < chars.length; i += 4) {
        chars[i] += separator;
      }
      const formattedInt = chars.reverse().join('');
      return isNegative ? `-${formattedInt}` : formattedInt;
    }

    return integerStr;
  };

  if (!isNaN(parseFloat(num))) {
    if (lng === 'pt') {
      const numString = num.toString().replace(',', '.'); // normalize commas if input is already Euro-styled
      const [integerStr, decimalStr] = numString.split('.');
      const formattedInt = formatIntWithThousands(integerStr, '.');
      return decimalStr && decimalStr !== '0' ? `${formattedInt},${decimalStr}` : formattedInt;
    } else if (lng === 'sk' || numericFormatRegion === 'sk') {
      const numString = num.toString().replace(/\s/g, '').replace(',', '.');
      const [integerStr, decimalStr] = numString.split('.');
      const formattedInt = formatIntWithThousands(integerStr, ' ');
      return decimalStr && decimalStr !== '0' ? `${formattedInt},${decimalStr}` : formattedInt;
    } else if (lng === 'en' || !lng) {
      const numString = num.toString().replace('.', ','); // normalize dots if input is already Euro-styled
      const [integerStr, decimalStr] = numString.split(',');
      const formattedInt = formatIntWithThousands(integerStr, ',');
      return decimalStr && decimalStr !== '0' ? `${formattedInt}.${decimalStr}` : formattedInt;
    }
  }
  return num.toString();
};

export default formatNumberEU;

/**
 *
 * @param {number|string} num Number or string (that represents a number)
 * @returns {string} A number formatted in European style: periods for thousands, commas for decimals
 */
const formatNumberEU = num => {
  const location = typeof window !== 'undefined' ? window.location : null;
  const queryParams = location ? new URLSearchParams(location.search) : null;
  const lng = queryParams ? queryParams.get('lng') : null;
  if (!isNaN(parseFloat(num))) {
    if (lng === 'pt') {
      const numString = num.toString().replace(',', '.'); // normalize commas if input is already Euro-styled
      const [integerStr, decimalStr] = numString.split('.');
      const chars = integerStr.split('');

      if (chars.length > 3 && chars[0] !== '-') {
        chars.reverse();
        for (let i = 3; i < chars.length; i += 4) {
          chars[i] += '.'; // use dot as thousands separator
        }
        const formattedInt = chars.reverse().join('');
        return decimalStr && decimalStr !== '0' ? `${formattedInt},${decimalStr}` : formattedInt;
      } else {
        return decimalStr && decimalStr !== '0'
          ? `${integerStr},${decimalStr}`
          : integerStr;
      }
    } else if (lng === 'en' || !lng) {
      const numString = num.toString().replace('.', ','); // normalize dots if input is already Euro-styled
      const [integerStr, decimalStr] = numString.split(',');
      const chars = integerStr.split('');

      if (chars.length > 3 && chars[0] !== '-') {
        chars.reverse();
        for (let i = 3; i < chars.length; i += 4) {
          chars[i] += ','; // use comma as thousands separator
        }
        const formattedInt = chars.reverse().join('');
        return decimalStr && decimalStr !== '0' ? `${formattedInt}.${decimalStr}` : formattedInt;
      } else {
        return decimalStr && decimalStr !== '0'
          ? `${integerStr}.${decimalStr}`
          : integerStr;
      }
    }
  }
  return num.toString();
};

export default formatNumberEU;

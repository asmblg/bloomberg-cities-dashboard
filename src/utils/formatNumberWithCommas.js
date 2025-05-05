/**
 *
 * @param {number|string} num Number or string (that represents a number)
 * @returns {string} A number formatted in European style: periods for thousands, commas for decimals
 */
const formatNumberEU = num => {
  if (!isNaN(parseFloat(num))) {
    const numString = num.toString().replace(',', '.'); // normalize commas if input is already Euro-styled
    const [integerStr, decimalStr] = numString.split('.');
    const chars = integerStr.split('');

    if (chars.length > 3 && chars[0] !== '-') {
      chars.reverse();
      for (let i = 3; i < chars.length; i += 4) {
        chars[i] += '.'; // use dot as thousands separator
      }
      const formattedInt = chars.reverse().join('');
      return decimalStr ? `${formattedInt},${decimalStr}` : formattedInt;
    } else {
      return decimalStr
        ? `${integerStr},${decimalStr}`
        : integerStr;
    }
  }
  return num.toString();
};

export default formatNumberEU;

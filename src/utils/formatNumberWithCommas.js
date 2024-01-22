import numeral from 'numeral';
/**
 *
 * @param {number} num Number or string (that represents a number)
 * @returns A number that is a string with a commas every 3rd character from the right
 */

const formatNumberWithCommas = num => {
  if (!isNaN(parseFloat(num))) {
    const numString = num.toString();
    const [integerStr, decimalStr] = numString.split('.');
    const stringToFormat = decimalStr ? integerStr : numString;
    const chars = stringToFormat.split('');
    // allows to add commas after every 3rd char from the right
    if (chars.length > 3 && chars?.[0] !== '-') {
      chars.reverse();

      for (var i = 3; i < chars.length; i += 3) {
        // add a comma after every third char
        chars[i] += ',';
      }
      const numberWithCommas = `${chars.reverse().join('')}`;
      // console.log(numberWithCommas);

      return decimalStr ? `${numberWithCommas}.${decimalStr}` : numberWithCommas;
    } else {
      return decimalStr && decimalStr !== '0' ? `${integerStr}.${decimalStr}` : integerStr;
    }
  }
  return numeral(num).format('0,0');
};

export default formatNumberWithCommas;

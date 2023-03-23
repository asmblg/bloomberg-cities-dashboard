/**
 *
 * @param {number} num Number or string (that represents a number)
 * @returns A number that is a string with a commas every 3rd character from the right
 */

const formatNumberWithCommas = num => {
  if (!isNaN(parseFloat(num))) {
    const numString = num.toString();
    const chars = numString.split('');
    // allows to add commas after every 3rd char from the right
    if (chars.length > 3) {
      chars.reverse();

      for (var i = 3; i < chars.length; i += 3) {
        // add a comma after every third char
        chars[i] += ',';
      }
      return chars.reverse().join('');
    }
  }
  return num.toString();
};

export default formatNumberWithCommas;

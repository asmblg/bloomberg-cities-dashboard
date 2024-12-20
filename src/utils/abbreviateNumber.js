/**
 * 
 * @param {number} num number or string representation of a number
 * @returns abbreviated version of number
 */

const abbreviateNumber = (num) => {
  if (num) {
    const number = typeof num === 'string' ? Number(num) : num;

    if (number >= 1000000000 || number <= -1000000000) {
      return (number / 1000000000).toFixed(1) + 'B';
    }
    if (number >= 1000000 || number <= -1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    }
    if (number >= 1000 || number <= -1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  }
  return null;
};

export default abbreviateNumber;

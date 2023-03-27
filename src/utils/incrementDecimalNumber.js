/**
 *
 * @param {number} num decimal number to increase - handles number and string
 * @returns decimal number that has been increased by 1 in it's last decimal place
 */

const incrementDecimalNumber = num => {
  const str = typeof num === 'number' ? `${num}` : num;
  const parts = str.split('.');
  // Get the decimal portion of the number
  const last = parts[parts.length - 1];
  // If last digit is 9, set it to 0, otherwise add 1
  const newLast = parseInt(last) === 9 ? '0' : (parseInt(last) + 1).toString();
  // If the length of the new last digit is the same as the length of the old last digit,
  // set the new decimal part to be the new last digit.
  // If they are different lengths, pad the new last digit with leading zeroes so that it has the same length as the old last digit.
  const newDecimalPart =
    newLast.length === last.length ? newLast : newLast.padStart(last.length, '0');
  // Combine the non-decimal parts of the original number with the new decimal part,
  // and convert the resulting string back to a number.
  const newParts = parts.slice(0, parts.length - 1).concat(newDecimalPart);
  return parseFloat(newParts.join('.'));
};

export default incrementDecimalNumber;

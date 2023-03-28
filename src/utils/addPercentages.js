/**
 *
 * @param {number} num1 - number or string a representation of a number
 * @param {number} num2 - number or a string representation of a number
 * @param {number} numDecimals - number of decimals on the return value
 * @returns sum of both numbers
 */

const addPercentages = (num1, num2, numDecimals) => {
  if (num1 && num2) {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    return !isNaN(number1) && !isNaN(number2)
      ? Number(parseFloat(num1) + parseFloat(num2)).toFixed(numDecimals)
      : null;
  }
  return null;
};

export default addPercentages;

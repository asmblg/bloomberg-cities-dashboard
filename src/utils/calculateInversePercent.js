/**
 *
 * @param {number} num1
 * @param {number} num2
 * @returns - if passed two numbers: calculate num1 as the inverse percent of num2. If passed one number, will calculate inverse percent of that number Ex: 100 - num1.
 * Will return null if passed only one number that is greater than 100 OR if there are not two numbers to calculate the percentage of.
 */

const calculateInversePercent = (num1, num2) => {
  const number1 = num1 ? parseFloat(num1) : null;
  const number2 = num2 ? parseFloat(num2) : null;

  if (number1 && number2) {
    return Number(100 - (parseFloat(number1) / parseFloat(number2)) * 100).toFixed(1);
  } else if (number1 && number1 <= 100) {
    return Number(100 - number1).toFixed(1);
  } else {
    return null;
  }
};

export default calculateInversePercent;

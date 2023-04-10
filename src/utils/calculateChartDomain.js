
/**
 * 
 * @param {array} arr a data array used in recharts components - assumes an array of objects where one key is "name" while the rest are keys with numbers as values
 * @returns {array} [ lowestValue, highestValue ]
 */
const calculateChartDomain = arr => {
  if (arr) {
    let minVal = Number.MAX_VALUE;
    let maxVal = Number.MIN_VALUE;
  
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      const cityValues = Object.values(obj).filter(key => key !== obj.name);
      const cityMax = Math.max(...cityValues);
      const cityMin = Math.min(...cityValues);
  
      if (cityMax > maxVal) {
        maxVal = cityMax;
      }
  
      if (cityMin < minVal) {
        minVal = cityMin;
      }
    }
  
    return [roundToNearestTen(minVal), roundToNearestTen(maxVal)];
  }
  return null;
};

/**
 * 
 * @param {Number} num 
 * @returns num parameter rounded to the nearest 10
 */
function roundToNearestTen(num) {
  // Determine the sign of the input number (1 if positive, -1 if negative)
  const sign = Math.sign(num);
  // Take the absolute value of the input number
  const absNum = Math.abs(num);
  // Round the absolute value of the input number to the nearest 10
  const roundedAbsNum = Math.round(absNum / 10) * 10;
  // Multiply the rounded absolute value by the sign of the input number, and return the result
  return sign * roundedAbsNum;
}

export default calculateChartDomain;
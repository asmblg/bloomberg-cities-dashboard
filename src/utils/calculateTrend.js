/**
 *
 * @param {string or number} currentValue
 * @param {string or number} oldValue
 * @returns difference between two values and direction of the trend
 */

const calculateTrend = (currentValue, oldValue, trendUnits) => {
  const currentNum = parseFloat(currentValue);
  const oldNum = parseFloat(oldValue);

  if (isNaN(currentNum) || isNaN(oldNum)) {
    return { trendValue: null, trendDirection: null };
  }

  const difference = currentNum - oldNum;
  const change = trendUnits === '%' ? (difference / oldNum) * 100 : difference;

  const trendDirection = difference > 0 ? 'up' : difference < 0 ? 'down' : null;
  const value = `${change}`.includes('.') ? change.toFixed(2) : change;
  const trendValue = `${
    trendDirection === 'up' ? '+' : trendDirection === 'down' ? '-' : null
  } ${Math.abs(value)}${trendUnits}`;

  return {
    trendValue,
    trendDirection
  };
};

export default calculateTrend;

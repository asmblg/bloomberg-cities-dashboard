/**
 *
 * @param {string or number} currentValue
 * @param {string or number} oldValue
 * @param {string} trendUnits '%' or 'pp' 
 * @returns {object} { trendValue, trendDirection }
 */

const calculateTrend = (currentValue, oldValue, trendUnits) => {
  const currentNum = parseFloat(currentValue);
  const oldNum = parseFloat(oldValue);

  if (isNaN(currentNum) || isNaN(oldNum)) {
    return { trendValue: null, trendDirection: null };
  }

  const difference = currentNum - oldNum;
  const change = trendUnits === '%' ? (difference / oldNum) * 100 : difference;

  const trendDirection = difference >= 0 ? 'up' : 'down';
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

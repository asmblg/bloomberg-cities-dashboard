import numeral from 'numeral';
import formatNumberWithCommas from './formatNumberWithCommas';
/**
 *
 * @param {string or number} currentValue
 * @param {string or number} oldValue
 * @param {string} trendUnits '%' or 'pp'
 * @returns {object} { trendValue, trendDirection }
 */

const calculateTrend = (currentValue, oldValue, currentValueUnits) => {
  const currentNum = parseFloat(currentValue);
  const oldNum = parseFloat(oldValue);

  if (isNaN(currentNum) || isNaN(oldNum)) {
    return { trendValue: null, trendDirection: null };
  }

  const difference = currentNum - oldNum;
  const change = currentValueUnits !== 'percent' ? (difference / oldNum) * 100 : difference;
  const trendDirection = difference >= 0 ? 'up' : 'down';
  const value = `${change}`.includes('.') ? change.toFixed(2) : change;
  const trendValue = Math.abs(value);
  const directionText = trendDirection === 'up' ? '+' : trendDirection === 'down' ? '-' : null;
  const unitsString = currentValueUnits !== 'percent' ? '%' : 'pp';
  const trendText = `${directionText} ${formatNumberWithCommas(numeral(trendValue).format('0,0.0'))}${unitsString}`;

  return {
    trendValue: trendText,
    trendDirection
  };
};

export default calculateTrend;

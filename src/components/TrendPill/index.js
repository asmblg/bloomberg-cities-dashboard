import React from 'react';
import PropTypes from 'prop-types';

import formatValue from '../../utils/formatValue';
import dateToQuarter from '../../utils/dateToQuarter';
import calculateTrend from '../../utils/calculateTrend';
import upwardTrendIcon from './images/upward_trend_icon.png';
import downwardTrendIcon from './images/downward_trend_icon.png';
import './style.css';

const TrendPill = ({
  height,
  width,
  currentValue,
  compareValue,
  compareDate,
  units,
  positiveTrendDirection,
  displayCompareText
}) => {
  const { trendValue, trendDirection } = calculateTrend(currentValue, compareValue, units);

  const heightVal = height ? (typeof height === 'number' ? `${height}px` : height) : null;
  const widthVal = width ? (typeof width === 'number' ? `${width}px` : width) : null;

  return currentValue && compareValue && compareDate ? (
    <div className='trend-display-wrapper'>
      <div
        className={
          trendDirection === 'up' || positiveTrendDirection === 'down'
            ? 'upward-trend'
            : 'downward-trend'
        }
        style={{ height: heightVal || '', width: widthVal || '' }}
      >
        <img src={trendDirection === 'up' ? upwardTrendIcon : downwardTrendIcon} />
        <p>{trendValue}</p>
      </div>
      {displayCompareText ? (
        <p>{`vs ${formatValue(compareValue, units)} in ${dateToQuarter(
          compareDate,
          'QX YYYY'
        )}`}</p>
      ) : null}
    </div>
  ) : null;
};

TrendPill.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  compareDate: PropTypes.string,
  compareValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  units: PropTypes.string,
  positiveTrendDirection: PropTypes.string,
  displayCompareText: PropTypes.bool
};

export default TrendPill;

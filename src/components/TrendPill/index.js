import React from 'react';
import PropTypes from 'prop-types';

import formatNumberWithCommas from '../../utils/formatNumberWithCommas';
import dateToQuarter from '../../utils/dateToQuarter';
import calculateTrend from '../../utils/calculateTrend';
import upwardTrendIcon from './images/upward_trend_icon.png';
import downwardTrendIcon from './images/downward_trend_icon.png';
import './style.css';

const TrendPill = ({ height, width, currentValue, compareValue, compareDate, units }) => {
  const { trendValue, trendDirection } = calculateTrend(currentValue, compareValue, units);

  const heightVal = height ? (typeof height === 'number' ? `${height}px` : height) : null;
  const widthVal = width ? (typeof width === 'number' ? `${width}px` : width) : null;

  return (
    <div className='trend-display-wrapper'>
      <div
        className={trendDirection === 'up' ? 'upward-trend' : 'downward-trend'}
        style={{ height: heightVal || '', width: widthVal || '' }}
      >
        <img src={trendDirection === 'up' ? upwardTrendIcon : downwardTrendIcon} />
        <p>{trendValue}</p>
      </div>
      <p>{`vs ${formatNumberWithCommas(compareValue)} in ${dateToQuarter(
        compareDate,
        'QX YYYY'
      )}`}</p>
    </div>
  );
};

TrendPill.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  compareDate: PropTypes.string,
  compareValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  units: PropTypes.string
};

export default TrendPill;

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
  displayCompareText,
  compareValueUnderPill
}) => {
  const { trendValue, trendDirection } = calculateTrend(currentValue, compareValue, units);

  const heightVal = height ? (typeof height === 'number' ? `${height}px` : height) : null;
  const widthVal = width ? (typeof width === 'number' ? `${width}px` : width) : null;

  return (
    <div
      className='trend-display-wrapper'
      style={{ flexDirection: compareValueUnderPill ? 'column' : 'row' }}
    >
      {currentValue && compareValue && compareDate ? (
        <>
          <div
            className={
              (positiveTrendDirection === 'down' && trendDirection === 'down') ||
              (positiveTrendDirection === 'up' && trendDirection === 'up')
                ? 'upward-trend'
                : 'downward-trend'
            }
            style={{ height: heightVal || '', width: widthVal || '' }}
          >
            <img src={trendDirection === 'up' ? upwardTrendIcon : downwardTrendIcon} />
            <h5 className=''>{trendValue}</h5>
          </div>
          {displayCompareText ? (
            <h5 className='trend-pill-text' style={{ opacity: '0.8' }}>{`vs ${formatValue(
              compareValue,
              units
            )} in ${dateToQuarter(compareDate, 'QX YYYY')}`}</h5>
          ) : null}
        </>
      ) : (
        <>
          <div
            className={'no-data-pill'
            }
            style={{ height: heightVal || '', width: widthVal || '' }}
          >
            {/* <h5 className='no-data-pill-text'> */}
              Comparison Data Currently Unavailable
            {/* </h5>           */}
          </div>
        </>
      )}
    </div>
  );
};

TrendPill.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  compareDate: PropTypes.string,
  compareValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  units: PropTypes.string,
  positiveTrendDirection: PropTypes.string,
  displayCompareText: PropTypes.bool,
  compareValueUnderPill: PropTypes.bool
};

export default TrendPill;

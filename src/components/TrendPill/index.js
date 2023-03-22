import React from 'react';
import PropTypes from 'prop-types';

import upwardTrendIcon from './images/upward_trend_icon.png';
import downwardTrendIcon from './images/downward_trend_icon.png';
import './style.css';

const TrendPill = ({ direction, value, height, width }) => {
  const heightVal = height ? (typeof height === 'number' ? `${height}px` : height) : null;
  const widthVal = width ? (typeof width === 'number' ? `${width}px` : width) : null;
  return (
    <div
      className={direction === 'up' ? 'upward-trend' : 'downward-trend'}
      style={{ height: heightVal || '', width: widthVal || '' }}
    >
      <img src={direction === 'up' ? upwardTrendIcon : downwardTrendIcon} />
      <p>{value}</p>
    </div>
  );
};

TrendPill.propTypes = {
  direction: PropTypes.string,
  value: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default TrendPill;

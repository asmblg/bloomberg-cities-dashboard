import React from 'react';
import PropTypes from 'prop-types';

import upwardTrendIcon from './images/upward_trend_icon.png';
import downwardTrendIcon from './images/downward_trend_icon.png';
import './style.css';

const SummaryCard = ({ config }) => {
  const data = '';
  const chartData = [];
  const trendDirection = 'upward';
  const trendChange = 'XX.X'; // add symbol
  console.log(chartData);

  return (
    <div className='summary-card'>
      <div className='summary-header' role='heading'>
        {config.label.toUpperCase()}
      </div>
      <div className='summary-data-wrapper'>
        <div className='summary-data  standard-bold'>
          <div className='summary-value'>{data || '-'}</div>
          <div className='summary-units'>{config.units}</div>
        </div>
        <div className='summary-chart'></div>
      </div>
      {trendDirection === 'upward' || trendDirection === 'downward' ? (
        <div className={trendDirection === 'upward' ? 'upward-trend' : 'downward-trend'}>
          <img src={trendDirection === 'upward' ? upwardTrendIcon : downwardTrendIcon} />
          <p>{`${trendDirection === 'upward' ? '+' : '-'} ${trendChange}`}</p>
        </div>
      ) : null}
    </div>
  );
};

SummaryCard.propTypes = {
  config: PropTypes.object
};

export default SummaryCard;

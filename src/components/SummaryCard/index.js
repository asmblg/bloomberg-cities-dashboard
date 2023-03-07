import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Chart from '../Chart';
import upwardTrendIcon from './images/upward_trend_icon.png';
import downwardTrendIcon from './images/downward_trend_icon.png';
import './style.css';

const SummaryCard = ({ config, route }) => {
  const navigate = useNavigate();
  const data = '';
  // const chartData = [];
  const trendDirection = 'upward';
  const trendChange = 'XX.X'; // add symbol

  return (
    <div className='summary-card' onClick={() => navigate(route)}>
      <div className='summary-header' role='heading'>
        {config.label.toUpperCase()}
      </div>
      <div className='summary-data-wrapper'>
        <div className='summary-data  standard-bold'>
          <div className='summary-value'>{data || '-'}</div>
          <div className='summary-units'>{config.units}</div>
        </div>
        <div className='summary-chart'>
          <Chart config={config.chart} />
        </div>
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
  config: PropTypes.object,
  route: PropTypes.string
};

export default SummaryCard;

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Chart from '../Chart';
import upwardTrendIcon from './images/upward_trend_icon.png';
import downwardTrendIcon from './images/downward_trend_icon.png';
import './style.css';

const SummaryCard = ({ config, route }) => {
  const navigate = useNavigate();
  const trend = 'up';

  return (
    <div className='summary-card' onClick={() => navigate(route)}>
      <div className='summary-header' role='heading'>
        {config.label.toUpperCase()}
      </div>
      <div className='summary-data-wrapper'>
        <div className='summary-data bold-font'>
          <div className='summary-value'>{'-'}</div>
          <div className='summary-units'>{config.units}</div>
        </div>
        <div className='summary-chart'>
          <Chart
            data={null}
            config={config.chart}
            height={100}
            width={'100%'}
            margin={{ top: 30, right: 0, bottom: -10, left: -29 }}
          />
        </div>
      </div>
      {trend === 'up' || trend === 'down' ? (
        <div className={trend === 'up' ? 'upward-trend' : 'downward-trend'}>
          <img src={trend === 'up' ? upwardTrendIcon : downwardTrendIcon} />
          <p>{`${trend === 'up' ? '+' : '-'} ${'XX.X'}`}</p>
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

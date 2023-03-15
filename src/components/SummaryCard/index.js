import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import Chart from '../Chart';
import upwardTrendIcon from './images/upward_trend_icon.png';
import downwardTrendIcon from './images/downward_trend_icon.png';
import './style.css';

const SummaryCard = ({ config, route, viewType }) => {
  const [cardFullSize, setCardFullSize] = useState(false);
  const scrollToRef = useRef();
  const navigate = useNavigate();
  const trend = 'up';

  return (
    <div id={`${config.key}-summary-card`} ref={scrollToRef} className='summary-card'>
      <div className='summary-card-header' role='heading'>
        <div className='summary-card-title'>
          {viewType === 'mobile' ? (
            <Icon
              name={`angle ${cardFullSize ? 'up' : 'down'}`}
              link
              onClick={() => {
                setCardFullSize(!cardFullSize);
                scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ) : null}
          <div
            onClick={() => {
              if (viewType !== 'mobile') {
                navigate(route);
              }
            }}
          >
            {config.label.toUpperCase()}
          </div>
        </div>

        {viewType === 'mobile' && (trend === 'up' || trend === 'down') ? (
          <div className={trend === 'up' ? 'upward-trend ' : 'downward-trend '}>
            <img src={trend === 'up' ? upwardTrendIcon : downwardTrendIcon} />
            <p>{`${trend === 'up' ? '+' : '-'} ${'XX.X'}`}</p>
          </div>
        ) : null}
      </div>
      {viewType !== 'mobile' || cardFullSize ? (
        <>
          <div className='summary-data-wrapper'>
            <div className='summary-data bold-font'>
              <div className='summary-value'>{'89.9'}</div>
              <div className='summary-units'>{config.units}</div>
            </div>
            {config.chart?.type ? (
              <div className='summary-chart'>
                <Chart
                  data={null}
                  config={
                    config.chart.type !== 'donut' ? config.chart : { ...config.chart, radius: 40 }
                  }
                  height={100}
                  width={'100%'}
                  margin={{ top: 30, right: 0, bottom: -10, left: -29 }}
                />
              </div>
            ) : null}
          </div>
          {viewType !== 'mobile' && (trend === 'up' || trend === 'down') ? (
            <div className={trend === 'up' ? 'upward-trend' : 'downward-trend'}>
              <img src={trend === 'up' ? upwardTrendIcon : downwardTrendIcon} />
              <p>{`${trend === 'up' ? '+' : '-'} ${'XX.X'}`}</p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

SummaryCard.propTypes = {
  config: PropTypes.object,
  route: PropTypes.string,
  viewType: PropTypes.string
};

export default SummaryCard;

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import Chart from '../Chart';
import TrendPill from '../TrendPill';

import getNestedValue from '../../utils/getNestedValue';
import './style.css';

const SummaryCard = ({ config, data, route, viewType }) => {
  const [cardFullSize, setCardFullSize] = useState(false);
  const scrollToRef = useRef();
  const navigate = useNavigate();
  const { chart, dataPath, key, label, units } = config;
  const summaryData = getNestedValue(data, dataPath, key);
  const trend = 'down';
  const trendValue = '- 0.2pp';
  const summaryValue = null;

  return (
    <div id={`${key}-summary-card`} ref={scrollToRef} className='summary-card'>
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
          <h3
            onClick={() => {
              if (viewType !== 'mobile') {
                navigate(route);
              }
            }}
          >
            {label.toUpperCase()}
          </h3>
        </div>

        {viewType === 'mobile' && (trend === 'up' || trend === 'down') ? (
          <TrendPill direction={trend} value={trendValue} />
        ) : null}
      </div>
      {viewType !== 'mobile' || cardFullSize ? (
        <>
          <div className='summary-data-wrapper'>
            <div className='summary-data bold-font'>
              <h3 className='bold-font'>{summaryValue || '-'}</h3>
              {units ? <h5 className='summary-units'>{units}</h5> : null}
            </div>

            <div className='summary-chart'>
              {chart?.type && summaryData ? (
                <Chart
                  data={summaryData}
                  config={chart.type !== 'donut' ? chart : { ...chart, radius: 40 }}
                  height={100}
                  width={'100%'}
                  margin={{ top: 10, right: 0, bottom: -10, left: -20 }}
                />
              ) : null}
            </div>
          </div>
          {viewType !== 'mobile' && trendValue && trend ? (
            <TrendPill direction={trend} value={trendValue} />
          ) : null}
        </>
      ) : null}
    </div>
  );
};

SummaryCard.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  route: PropTypes.string,
  viewType: PropTypes.string
};

export default SummaryCard;

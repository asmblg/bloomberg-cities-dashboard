import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import Chart from '../Chart';
import TrendPill from '../TrendPill';

import getNestedValue from '../../utils/getNestedValue';
import { handleSummaryData } from './utils';
import './style.css';

const SummaryCard = ({ config, data, viewType }) => {
  const { chart, dataPath, key, label, units, summary } = config;
  const [cardFullSize, setCardFullSize] = useState(false);
  const [summaryData, setSummaryData] = useState({
    value: null,
    trendDirection: null,
    trendTextValue: null
  });
  const scrollToRef = useRef();
  // const navigate = useNavigate();
  const allSummaryData = getNestedValue(data, dataPath, key);

  useEffect(() => {
    if (data && allSummaryData) {
      setSummaryData(handleSummaryData(summary, allSummaryData));
    }
  }, [allSummaryData]);

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
          <h3>{label.toUpperCase()}</h3>
        </div>

        {viewType === 'mobile' &&
          (summaryData.trendDirection === 'up' || summaryData.trendDirection === 'down') ? (
            <TrendPill direction={summaryData.trendDirection} value={summaryData.trendTextValue} />
          ) : null}
      </div>
      {viewType !== 'mobile' || cardFullSize ? (
        <>
          <div className='summary-data-wrapper'>
            <div className='summary-data bold-font'>
              <h1 className='bold-font'>{summaryData.value || '-'}</h1>
              {units ? <h5 className='summary-units'>{units}</h5> : null}
            </div>

            <div className='summary-chart'>
              {chart?.type && allSummaryData ? (
                <Chart
                  data={chart.type !== 'donut' ? allSummaryData : { value: summaryData.value }}
                  config={chart}
                  height={100}
                  width={'100%'}
                  margin={{ top: 10, right: 5, bottom: -10, left: -15 }}
                />
              ) : null}
            </div>
          </div>
          {viewType !== 'mobile' && summaryData.trendDirection && summaryData.trendDirection ? (
            <TrendPill direction={summaryData.trendDirection} value={summaryData.trendTextValue} />
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

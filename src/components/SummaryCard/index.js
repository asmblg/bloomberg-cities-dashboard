import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import SummaryChart from './subComponents/SummaryChart';
import TrendPill from '../TrendPill';
import InfoIcon from '../InfoIcon';

import getNestedValue from '../../utils/getNestedValue';
import { handleSummaryData } from './utils';
import './style.css';

const SummaryCard = ({
  config,
  data,
  viewType,
  project,
  dashboardType,
  cardKey,
  setSelectedLink
}) => {
  const { chart, dataPath, key, label, units, summary } = config;
  const [cardFullSize, setCardFullSize] = useState(false);
  const [summaryData, setSummaryData] = useState({
    value: null,
    trendDirection: null,
    trendTextValue: null
  });
  const scrollToRef = useRef();
  const navigate = useNavigate();
  const allSummaryData = getNestedValue(data, dataPath, key);
  const route = `/${project}/${dashboardType}/${cardKey}`;

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
          <h4
            className='summary-card-header-text'
            // Where does Venture Capital Investment link to?
            onClick={() => {
              if (label !== 'Venture Capital Investment') {
                setSelectedLink(cardKey);
                navigate(route);
              }
            }}
          >
            {label.toUpperCase()}
          </h4>
          <InfoIcon
            source={'Test Data Inc'}
            variableDescription={
              'A data description that describes the data that needs to be described...'
            }
          />
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
                <SummaryChart
                  config={chart}
                  data={
                    chart.type !== 'donut'
                      ? allSummaryData
                      : { key: units, value: summaryData.value }
                  }
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
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  cardKey: PropTypes.string,
  viewType: PropTypes.string,
  setSelectedLink: PropTypes.func
};

export default SummaryCard;

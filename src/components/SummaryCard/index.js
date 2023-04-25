import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import SummaryChart from './subComponents/SummaryChart';
import TrendPill from '../TrendPill';
import InfoIcon from '../InfoIcon';

import getNestedValue from '../../utils/getNestedValue';
import formatValue from '../../utils/formatValue';
import createCompareDataObject from '../../utils/createCompareDataObject';
import './style.css';

const SummaryCard = ({
  config,
  data,
  viewType,
  project,
  // dashboardType,
  cardKey,
  setSelectedLink,
  trendDataType
}) => {
  // console.log(data);
  const { chart, dataPath, key, label, units, summary } = config;
  const [cardFullSize, setCardFullSize] = useState(false);
  const [summaryData, setSummaryData] = useState({
    displayValue: null,
    currentValue: null,
    currentDate: null,
    compareValue: null,
    compareDate: null
  });
  const scrollToRef = useRef();
  const navigate = useNavigate();
  const allSummaryData = getNestedValue(data, summary?.dataPath || dataPath, key);
  const route = `/${project}/${cardKey}`;

  useEffect(() => {
    if (data && allSummaryData) {
      setSummaryData(createCompareDataObject(summary.calculator, allSummaryData, trendDataType));
    }
  }, [allSummaryData, trendDataType]);

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
          <InfoIcon config={config?.indicator} />
        </div>

        {viewType === 'mobile' ? (
          <TrendPill
            currentValue={summaryData.currentValue}
            compareValue={summaryData.compareValue}
            compareDate={summaryData.compareDate}
            units={config.summary.trendUnits}
            data={allSummaryData}
            trendDataType={trendDataType}
            displayCompareText
          />
        ) : null}
      </div>
      {viewType !== 'mobile' || cardFullSize ? (
        <>
          <div className='summary-data-wrapper'>
            <div className='summary-data bold-font'>
              <h1 className='bold-font'>{summaryData.displayValue ?
                formatValue(summaryData.displayValue, units) 
                : '-'}</h1>
              {units ? <h5 className='summary-units'>{units}</h5> : null}
            </div>

            <div className='summary-chart'>
              {chart?.type && allSummaryData ? (
                <SummaryChart
                  config={chart}
                  data={
                    chart.type !== 'donut'
                      ? allSummaryData
                      : { key: units, value: summaryData.displayValue }
                  }
                />
              ) : null}
            </div>
          </div>
          {viewType !== 'mobile' ? (
            <TrendPill
              currentValue={summaryData.currentValue}
              compareValue={summaryData.compareValue}
              compareDate={summaryData.compareDate}
              units={config.summary.trendUnits}
              data={allSummaryData}
              trendDataType={trendDataType}
              displayCompareText
            />
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
  setSelectedLink: PropTypes.func,
  trendDataType: PropTypes.string
};

export default SummaryCard;

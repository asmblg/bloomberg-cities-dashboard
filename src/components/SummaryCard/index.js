import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import SummaryChart from './subComponents/SummaryChart';
import TrendPill from '../TrendPill';
import InfoIcon from '../InfoIcon';

import getNestedValue from '../../utils/getNestedValue';
import formatValue from '../../utils/formatValue';
import formatQuarterDate from '../../utils/formatQuarterDate';
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
  const { chart, dataPath, key, label, units, summary, indicator } = config;
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
  // Handles issue with there being newbusiness data but the actual section on the dashboard is smallbusiness
  const sectionKey = cardKey === 'newbusiness' ? 'smallbusiness' : cardKey;
  const route = `/${project}/${sectionKey}`;

  useEffect(() => {
    if (data && allSummaryData) {
      setSummaryData(
        createCompareDataObject(summary?.calculator, allSummaryData, trendDataType, summary?.filter)
      );
    }
  }, [allSummaryData, trendDataType]);

  return (
    <div id={`${key}-summary-card`} ref={scrollToRef} className='summary-card'>
      <div className='summary-card-header' role='heading'>
        <div className='summary-card-title'>
          {viewType === 'mobile' ? (
            <Icon
              name={`angle ${cardFullSize ? 'down' : 'up'}`}
              link
              onClick={() => {
                setCardFullSize(!cardFullSize);
                scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ) : null}
          <h4 className='summary-card-header-text'>{label.toUpperCase()}</h4>
          <div>
            <InfoIcon config={config?.indicator} popup />
          </div>
        </div>

        {viewType === 'mobile' && !cardFullSize ? (
          <TrendPill
            positiveTrendDirection={summary?.positiveTrendDirection}
            currentValue={summaryData.currentValue}
            compareValue={summaryData.compareValue}
            compareDate={summaryData.compareDate}
            units={config.summary.trendUnits}
            data={allSummaryData}
            trendDataType={trendDataType}
            displayCompareText={viewType !== 'mobile'}
          />
        ) : null}
      </div>
      {indicator?.Geography &&
      (viewType === 'desktop' ||
        viewType === 'tablet' ||
        (viewType === 'mobile' && cardFullSize)) ? (
          <h5 className='summary-card-sub-header'>{indicator.Geography}</h5>
        ) : null}
      {viewType !== 'mobile' || cardFullSize ? (
        <>
          <div
            className='summary-data-wrapper'
            onClick={() => {
              // if (label !== 'Venture Capital Investment') {
              setSelectedLink(sectionKey);
              navigate(route);
              // }
            }}
          >
            <div className='summary-data bold-font'>
              <h1 className='bold-font'>
                {summaryData.displayValue
                  ? formatValue(summaryData.displayValue, config?.summary?.trendUnits)
                  : '-'}
              </h1>
              {units ? <h5 className='summary-units'>{units}</h5> : null}
              {summaryData?.currentDate ? <h5 className='summary-indicator-date'>{formatQuarterDate(summaryData.currentDate, 'QX YYYY', true)}</h5> : null }
              {/* {summaryData?.currentDate ? <h5 className='summary-indicator-date'>{summaryData.currentDate}</h5> : null } */}

            </div>

            <div className='summary-chart'>
              {chart?.type && allSummaryData ? (
                <SummaryChart
                  config={chart}
                  viewType={viewType}
                  data={
                    chart.type !== 'donut'
                      ? allSummaryData
                      : { key: summaryData.currentDate, value: summaryData.displayValue }
                  }
                />
              ) : null}
            </div>
          </div>
          {viewType !== 'mobile' || cardFullSize ? (
            <TrendPill
              positiveTrendDirection={summary?.positiveTrendDirection}
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

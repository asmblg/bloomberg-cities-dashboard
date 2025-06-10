import React, { useState, useRef, useEffect, use } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import SimpleChart from './subComponents/SimpleChart';
import TrendPill from '../TrendPill';
import InfoIcon from '../InfoIcon';

import getNestedValue from '../../utils/getNestedValue';
import formatValue from '../../utils/formatValue';
import formatQuarterDate from '../../utils/formatQuarterDate';
import createCompareDataObject from '../../utils/createCompareDataObject';
import './style.css';

const SimpleCard = ({
  config,
  data,
  viewType,
  project,
  // dashboardType,
  cardKey,
  setSelectedLink,
  getter,
  // trendDataType,
}) => {
  const { 
    chart, 
    key,
    label,
    units,
    summary,
    // indicator,
    disablePill,
    getterKey 
  } = config;
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
  const [allSummaryData, setAllSummaryData] = useState();
  const [dataPath, setDataPath] = useState(config?.dataPath);
  const selectorPath = getter?.[getterKey?.selectorPath];
  const selectedIndicator = getter?.[getterKey?.selectedIndicator];

  // console.log({ config });

  useEffect(() => {

    if (data) {
      setAllSummaryData(getNestedValue(data, dataPath, key));
    }
  }, [
    data,
    dataPath
  ]);


  useEffect(() => {

    if (
      getter?.[getterKey?.selectorPath] ||
      getter?.[getterKey?.selectedIndicator]
      ) {
      let newDataPathArray = [];
      const currentPath = summary?.dataPath || config?.dataPath;
      const currentPathArray = currentPath.split('.');
      // const currentPathArrayLength = currentPathArray.length;

      const selectorDataPath = selectorPath?.dataPath
      
      const spliceIndex = currentPathArray.length - (config?.splicePosition || 2);
      if (selectorDataPath) {
        const selectorDataPathArray = selectorDataPath.split('.');
        selectorDataPathArray.forEach((path, index) => {
          newDataPathArray.push(path);
        });
        if (selectedIndicator) {
          newDataPathArray.push(selectedIndicator?.value || selectedIndicator);
        } else {
          newDataPathArray.push(currentPathArray[currentPathArray.length - 1]);
        }
      } else {
      currentPathArray.forEach((path, index) => {
        if (
          selectorPath && 
          index === spliceIndex
        ) {
          newDataPathArray.push(selectorPath?.value || selectorPath);
        } else if (
          selectedIndicator &&
          index === currentPathArray.length - 1
        ) {
          newDataPathArray.push(selectedIndicator?.value || selectedIndicator); 
        } else {
          newDataPathArray.push(path);
        }

      }
      );
    }



      if (newDataPathArray.length) {

        setDataPath(newDataPathArray.join('.'));
      }
    }
  }, [
    getter?.[getterKey?.selectorPath],
    getter?.[getterKey?.selectedIndicator]
  ]);

  getNestedValue(data, summary?.dataPath || dataPath, key);
  // Handles issue with there being newbusiness data but the actual section on the dashboard is smallbusiness
  const sectionKey = cardKey === 'newbusiness' ? 'smallbusiness' : cardKey;
  const route = config?.route || `/${project}/${sectionKey}`;

  // const getterKey = config?.getterKey || {};
  let trendDataType = getter?.[getterKey?.trendDataType] || null;
  if (config?.dateType === 'year') {
    if (trendDataType === 'QtQ') {
      trendDataType = 'YtY';
    } else if (trendDataType === 'YtY') {
      trendDataType = 'QtQ';
    } else {
      trendDataType = 'YtY';
    }
  }
  // console.log({ trendDataType });

  useEffect(() => {
    if (data && allSummaryData) {
      setSummaryData(
        createCompareDataObject(
          summary?.calculator, 
          allSummaryData, 
          trendDataType, 
          summary?.filter
        )
      );
    }
  }, [allSummaryData, trendDataType]);

  return (
    <div
      key={`${dataPath?.replace(/\./g, '-')}-simple-card`}
      ref={scrollToRef}
      className='simple-card'
    >
      <div className='simple-card-header' role='heading'

      >
        <div className='simple-card-title'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '5px'
                  }}
        >
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
          <h4 className='simple-card-header-text'>{label?.toUpperCase() || 'UNDEFINED'}</h4>
          <div>
            <InfoIcon config={config?.indicator} popup />
          </div>
        </div>

        {viewType === 'mobile' && !cardFullSize && !disablePill ? (
          <TrendPill
            positiveTrendDirection={summary?.positiveTrendDirection}
            currentValue={summaryData.currentValue}
            compareValue={summaryData.compareValue}
            compareDate={summaryData.compareDate}
            units={config.summary.trendUnits}
            data={allSummaryData}
            trendDataType={trendDataType}
            displayCompareText={viewType !== 'mobile'}
            onlyYears={config?.dateType === 'year'}

          />
        ) : null}
      </div>

      <h5 className='simple-card-sub-header'>
      {  `${
        (selectorPath && selectedIndicator) || selectedIndicator
          ? `${selectedIndicator?.label || selectedIndicator}, ${selectorPath?.label || selectorPath || config?.indicator?.Geography}`
          : selectorPath && 
            !selectedIndicator && 
            config?.indicator?.Geography && 
            `${config?.indicator?.Geography}`?.toLowerCase() !== `${selectorPath}`?.toLowerCase() &&
            `${config?.indicator?.Geography}`?.toLowerCase() !== selectorPath?.label?.toLowerCase()
            ? selectorPath?.label?.toLowerCase() !== 'total' && 
              `${selectorPath}`?.toLowerCase() !== 'total'
              ? `${selectorPath?.label || selectorPath}` 
              : config?.defaultSubheading || config?.indicator?.Geography
            : selectorPath && !selectedIndicator
              ? `${selectorPath?.label || selectorPath}`
              : config?.defaultSubheading || config?.indicator?.Geography
      }`.toLocaleUpperCase()}

      </h5>
      {viewType !== 'mobile' || cardFullSize ? (
        <>
          <div
            className='simple-data-wrapper'
            // style={{
            //   flexDirection: 'row-reverse'
            // }}
            onClick={() => {
              // if (label !== 'Venture Capital Investment') {
              setSelectedLink(sectionKey);
              navigate(route);
              // }
            }}
          >

            <div className='simple-chart'>
              {chart?.type && allSummaryData ? (
                <SimpleChart
                  key={`${dataPath}-${cardKey}-simple-chart`}
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
            <div className='simple-data bold-font'>
              <h2 className='bold-font'>
                {summaryData.displayValue
                  ? formatValue(summaryData.displayValue, config?.summary?.trendUnits)
                  : '-'}
              </h2>
              {units ? <h5 className='simple-units'>{units}</h5> : null}
              {summaryData?.currentDate ? <h5 className='simple-indicator-date'>{formatQuarterDate(summaryData.currentDate, 'QX YYYY', true)}</h5> : null}
              {/* {summaryData?.currentDate ? <h5 className='simple-indicator-date'>{summaryData.currentDate}</h5> : null } */}

            </div>

          </div>
          {!disablePill && (viewType !== 'mobile' || cardFullSize) ? (
            <TrendPill
              positiveTrendDirection={summary?.positiveTrendDirection}
              currentValue={summaryData.currentValue}
              compareValue={summaryData.compareValue}
              compareDate={summaryData.compareDate}
              units={config?.summary?.trendUnits}
              data={allSummaryData}
              trendDataType={trendDataType}
              displayCompareText
              onlyYears={config?.dateType === 'year'}
            />
          ) : null}
        </>
      ) : null}
      {/* <h5>{dataPath}</h5> */}

    </div>
  );
};

SimpleCard.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  cardKey: PropTypes.string,
  viewType: PropTypes.string,
  setSelectedLink: PropTypes.func,
  trendDataType: PropTypes.string
};

export default SimpleCard;

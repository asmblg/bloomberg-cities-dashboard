import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import SinglePercentDonutChart from '../SinglePercentDonutChart';
// import InfoIcon from '../InfoIcon';
import TrendPill from '../TrendPill';

import { handleTrendDisplayData } from './utils';
import formatValue from '../../utils/formatValue';
import dateToQuarter from '../../utils/dateToQuarter';
import getNestedValue from '../../utils/getNestedValue';
import './style.css';

const IndicatorTrendBox = ({ data, config, getter }) => {
  const [indicatorTrendData, setIndicatorTrendData] = useState({
    currentDate: null,
    currentValue: null,
    compareDate: null,
    compareValue: null,
    displayValue: null
  });
  const { 
    indicator, 
    displayCompareText,
    dataPath,
    getterKey,
    chart,
    layoutVariation
  } = config;
  const trendDataType = getter?.[getterKey?.trendValue] || 'QtQ';

  const selectedCategory =
    getter && getterKey?.selectedCategory ? getter[getterKey.selectedCategory] : null;

  const selectedIndicator =
    !indicator && getterKey?.selectedIndicator
      ? getter[getterKey.selectedIndicator]
      : indicator || null;
  
  const baseDataPath = getter?.[getterKey?.dataPath] || dataPath;

  useEffect(() => {
    if (data) {
      const nestedDataObj =
        baseDataPath && selectedCategory?.key
          ? getNestedValue(data, `${baseDataPath}.${selectedCategory.key}`)
          : baseDataPath && !selectedCategory
            ? getNestedValue(data, baseDataPath)
            : !baseDataPath && !selectedCategory
              ? { ...data }
              : null;

      if (nestedDataObj && selectedIndicator) {
        const dataObj = handleTrendDisplayData(nestedDataObj, selectedIndicator, trendDataType);
        if (selectedIndicator.units?.match(/dollars/i) && dataObj.currentValue) {
          dataObj.currentValue = parseFloat(`${dataObj.currentValue}`.replace('$', ''));
          dataObj.compareValue = dataObj.compareValue
            ? parseFloat(`${dataObj.compareValue}`.replace('$', ''))
            : null;
        }
        setIndicatorTrendData(dataObj);
      }
    }
  }, [selectedIndicator, data, selectedCategory, trendDataType, baseDataPath]);

  return indicatorTrendData?.displayValue && selectedIndicator ? (
    <div className='indicator-trend-wrapper' style={layoutVariation === 'label-on-top' ? {padding: '0'} : {}}>
      {chart?.type === 'donut' && indicatorTrendData.displayValue ? (
        <div style={{ width: '25%' }}>
          <SinglePercentDonutChart
            value={indicatorTrendData.displayValue}
            height={100}
            width={'100%'}
            config={chart.config}
          />
        </div>
      ) : null}
      <div style={{ width: chart ? '75%' : '100%' }}>
        {layoutVariation === 'label-on-top' ? (
          <div style={{ maxWidth: '90%', height: '50px' }}>
            <h4 className='bold-font'>{selectedIndicator.label || ''}</h4>
          </div>
        ) : null}
        <div className='indicator-data-body'>
          <div className='indicator-value-container'>
            <h1 className='bold-font' >
              {formatValue(indicatorTrendData.displayValue, selectedIndicator.units)}
            </h1>
            {layoutVariation !== 'label-on-top' ? (
              <div>
                <h4>{selectedIndicator.label?.toUpperCase() || ''}</h4>
                <h4>{dateToQuarter(indicatorTrendData.currentDate, 'QX YYYY')}</h4>
              </div>
            ) : (
              <TrendPill
                currentValue={indicatorTrendData.currentValue}
                compareValue={indicatorTrendData.compareValue}
                compareDate={indicatorTrendData.compareDate}
                units={selectedIndicator.units}
                positiveTrendDirection={selectedIndicator.positiveTrendDirection}
                data={data[selectedIndicator.key]}
                displayCompareText={displayCompareText}
              />
            )}
            
          </div>
          {/* <InfoIcon config={selectedIndicator} /> */}
        </div>
        {layoutVariation !== 'label-on-top' ? (
          <TrendPill
            currentValue={indicatorTrendData.currentValue}
            compareValue={indicatorTrendData.compareValue}
            compareDate={indicatorTrendData.compareDate}
            units={selectedIndicator.units}
            positiveTrendDirection={selectedIndicator.positiveTrendDirection}
            data={data[selectedIndicator.key]}
            displayCompareText={displayCompareText}
          />
        ) : null}
        
      </div>
    </div>
  ) : null;
};

IndicatorTrendBox.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object,
  viewType: PropTypes.string
};

export default IndicatorTrendBox;
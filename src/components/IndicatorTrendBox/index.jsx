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

const IndicatorTrendBox = ({ data, config, getter, viewLoaded }) => {
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
    layoutVariation,
    label,
    subLabel,
    dateOverride,
    showIndicatorText,
    compareValueUnderPill,
    hideIndicatorLabel,
    // noPill
    // useAlternateIndicator
  } = config;

  // console.log(indicator);


  const trendDataType = getter?.[getterKey?.trendValue] || 'QtQ';

  const selectedCategory = getter && getterKey?.selectedCategory 
    ? getter[getterKey.selectedCategory] 
    : null;

  const selectedIndicator = getter?.[getterKey?.selectedIndicator]?.alternate || 
    getter?.[getterKey?.selectedIndicator] || 
    indicator;


  if (selectedIndicator?.noPill) {
    config.noPill = true;
  } else {
    config.noPill = false;
  }

  const noPill = config.noPill;

  // console.log(getterKey?.selectedIndicator, getter, selectedIndicator);
  
  const baseDataPath = selectedIndicator?.dataPath || getter?.[getterKey?.dataPath] || dataPath;

  // console.log(selectedIndicator, data);
  // console.log(selectedIndicator, indicatorTrendData);


  useEffect(() => {
    if (data) {
      const nestedDataObj = baseDataPath && selectedCategory?.key
        ? getNestedValue(data, `${baseDataPath}.${selectedCategory.key}`)
        : baseDataPath && !selectedCategory
          ? getNestedValue(data, baseDataPath)
          : !baseDataPath && !selectedCategory
            ? { ...data }
            : null;
      // console.log(nestedDataObj);

      if (nestedDataObj && selectedIndicator) {
        const dataObj = handleTrendDisplayData(nestedDataObj, selectedIndicator, trendDataType);
        if (selectedIndicator.units?.match(/dollars/i) && dataObj?.currentValue) {
          dataObj.currentValue = parseFloat(`${dataObj.currentValue}`.replace('$', ''));
          dataObj.compareValue = dataObj.compareValue
            ? parseFloat(`${dataObj.compareValue}`.replace('$', ''))
            : null;
        }
        if (dataObj) {
          setIndicatorTrendData(dataObj);
        }
      }
    }
  }, [
    selectedIndicator,
    selectedIndicator?.alternate,
    data, 
    selectedCategory, 
    trendDataType, 
    baseDataPath,
    viewLoaded
  ]);

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
        {layoutVariation === 'label-on-top' && !hideIndicatorLabel && (label || selectedIndicator?.label) ? (
          <div className='indicator-trend-top-label'>
            <h4>{`${label || selectedIndicator.label}`.toUpperCase()}</h4>
            {subLabel || selectedIndicator?.subLabel && (
              <h4>{`${subLabel || selectedIndicator.subLabel}`.toUpperCase()}</h4>
            )}
            <h4>{dateOverride || dateToQuarter(indicatorTrendData.currentDate, 'QX YYYY')}</h4>
          </div>
        ) : null}
        <div className='indicator-data-body'>
          <div className='indicator-value-container'>
            <h1 className='bold-font' >
              {formatValue(indicatorTrendData.displayValue, selectedIndicator.units)}
            </h1>
            {layoutVariation !== 'label-on-top' ?
              !hideIndicatorLabel && (
                <div>
                  {
                    selectedIndicator?.text && showIndicatorText
                      ? <h5>{selectedIndicator?.text }</h5>
                      : null
                  }
                  <h4>{label?.toUpperCase() || selectedIndicator.trendBoxLabel?.toUpperCase() || selectedIndicator.label?.toUpperCase() || ''}</h4>
                  <h4>{dateOverride || dateToQuarter(indicatorTrendData.currentDate, 'QX YYYY')}</h4>
                </div>
              )
              : !noPill && (
                <TrendPill
                  currentValue={indicatorTrendData.currentValue}
                  compareValue={indicatorTrendData.compareValue}
                  compareDate={indicatorTrendData.compareDate}
                  units={selectedIndicator.units}
                  positiveTrendDirection={selectedIndicator.positiveTrendDirection}
                  data={data[selectedIndicator.key]}
                  displayCompareText={displayCompareText}
                  compareValueUnderPill={compareValueUnderPill}
                />
              )}
            
          </div>
          {/* <InfoIcon config={selectedIndicator} /> */}
        </div>
        {layoutVariation !== 'label-on-top' && !noPill ? (
          <TrendPill
            currentValue={indicatorTrendData.currentValue}
            compareValue={indicatorTrendData.compareValue}
            compareDate={indicatorTrendData.compareDate}
            units={selectedIndicator.units}
            positiveTrendDirection={selectedIndicator.positiveTrendDirection}
            data={data[selectedIndicator.key]}
            displayCompareText={displayCompareText}
            compareValueUnderPill={compareValueUnderPill}
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
  viewType: PropTypes.string,
  viewLoaded: PropTypes.bool
};

export default IndicatorTrendBox;
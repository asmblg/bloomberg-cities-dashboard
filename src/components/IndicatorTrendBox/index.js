import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import InfoIcon from '../InfoIcon';
import TrendPill from '../TrendPill';

import { handleTrendDisplayData } from './utils';
import formatValue from '../../utils/formatValue';
import dateToQuarter from '../../utils/dateToQuarter';
import getNestedValue from '../../utils/getNestedValue';
import './style.css';

const IndicatorTrendBox = ({ data, config, getter }) => {
  console.log(data);
  const [indicatorTrendData, setIndicatorTrendData] = useState({
    currentDate: null,
    currentValue: null,
    compareDate: null,
    compareValue: null,
    displayValue: null
  });
  const { indicator, displayCompareText, dataPath } = config;
  const hasMultipleGetters = config.getterKey && typeof config.getterKey !== 'string';

  const trendDataType =
    !hasMultipleGetters
      ? getter[config.getterKey]
      : getter[config.getterKey[0]];

  const selectedKey =
    hasMultipleGetters ? getter[config.getterKey[1]] : null;
  
  const requiresSelectedKey = hasMultipleGetters && config.getterKey?.[1];

  const selectedIndicator =
    !indicator && config.getterKey && typeof config.getterKey !== 'string' && config.getterKey[2]
      ? getter[config.getterKey[2]]
      : indicator || null;
   

  useEffect(() => {
    if (data) {
      const nestedDataObj =
        dataPath && requiresSelectedKey && selectedKey?.key
          ? getNestedValue(data, `${dataPath}.${selectedKey.key}`)
          : dataPath && !requiresSelectedKey
            ? getNestedValue(data, dataPath)
            : !dataPath && !selectedKey?.key
              ? { ...data }
              : null;

      if (nestedDataObj && selectedIndicator) {
        const dataObj = handleTrendDisplayData(nestedDataObj, selectedIndicator, trendDataType);
        if (selectedIndicator.units === 'dollars' && dataObj.currentValue) {
          dataObj.currentValue = parseFloat(dataObj.currentValue.replace('$', ''));
          dataObj.compareValue = dataObj.compareValue ? parseFloat(dataObj.compareValue.replace('$', '')) : null;
        }
        setIndicatorTrendData(dataObj);
      }
    }
  }, [getter, data, selectedKey]);

  return indicatorTrendData?.displayValue && selectedIndicator ? (
    <div className='indicator-trend-container'>
      <div className='indicator-data-body'>
        <div className='indicator-value-container'>
          <h1 className='bold-font'>
            {formatValue(indicatorTrendData.displayValue, selectedIndicator.units)}
          </h1>
          <div>
            <h4>{selectedIndicator.label?.toUpperCase() || ''}</h4>
            <h4>{dateToQuarter(indicatorTrendData.currentDate, 'QX YYYY')}</h4>
          </div>
        </div>
        <InfoIcon variableDescription={selectedIndicator.label} />
      </div>
      <TrendPill
        currentValue={indicatorTrendData.currentValue}
        compareValue={indicatorTrendData.compareValue}
        compareDate={indicatorTrendData.compareDate}
        units={selectedIndicator.units}
        positiveTrendDirection={selectedIndicator.positiveTrendDirection}
        data={data[selectedIndicator.key]}
        displayCompareText={displayCompareText}
      />
    </div>
  ) : null;
};

IndicatorTrendBox.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object
};

export default IndicatorTrendBox;

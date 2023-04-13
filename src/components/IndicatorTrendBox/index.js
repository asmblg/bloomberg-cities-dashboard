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
  const [indicatorTrendData, setIndicatorTrendData] = useState({
    currentDate: null,
    currentValue: null,
    compareDate: null,
    compareValue: null,
    displayValue: null
  });
  const { indicator, displayCompareText, dataPath, getterKey } = config;
  const trendDataType = getter?.[getterKey?.trendValue] || 'QtQ';
  const selectedCategory =
    getter && getterKey?.selectedCategory ? getter[getterKey.selectedCategory] : null;

  const selectedIndicator =
    !indicator && getterKey?.selectedIndicator
      ? getter[getterKey.selectedIndicator]
      : indicator || null;

  useEffect(() => {
    if (data) {
      const nestedDataObj =
        dataPath && selectedCategory?.key
          ? getNestedValue(data, `${dataPath}.${selectedCategory.key}`)
          : dataPath && !selectedCategory
          ? getNestedValue(data, dataPath)
          : !dataPath && !selectedCategory
          ? { ...data }
          : null;
      console.log(nestedDataObj);
      if (nestedDataObj && selectedIndicator) {
        const dataObj = handleTrendDisplayData(nestedDataObj, selectedIndicator, trendDataType);
        if (selectedIndicator.units === 'dollars' && dataObj.currentValue) {
          dataObj.currentValue = parseFloat(dataObj.currentValue.replace('$', ''));
          dataObj.compareValue = dataObj.compareValue
            ? parseFloat(dataObj.compareValue.replace('$', ''))
            : null;
        }
        setIndicatorTrendData(dataObj);
      }
    }
  }, [selectedIndicator, data, selectedCategory, trendDataType]);

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

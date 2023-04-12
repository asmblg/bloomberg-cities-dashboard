import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import InfoIcon from '../InfoIcon';
import TrendPill from '../TrendPill';

import { handleTrendDisplayData } from './utils';
import formatValue from '../../utils/formatValue';
import dateToQuarter from '../../utils/dateToQuarter';
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
  const { indicator, displayCompareText } = config;
  const trendDataType = getter[config.getterKey];

  useEffect(() => {
    if (data) {
      const dataObj = handleTrendDisplayData(data, indicator, trendDataType);
      setIndicatorTrendData(dataObj);
    }
  }, [trendDataType, data]);

  return indicatorTrendData?.displayValue ? (
    <div className='indicator-trend-container'>
      <div className='indicator-data-body'>
        <div className='indicator-value-container'>
          <h1 className='bold-font'>
            {formatValue(indicatorTrendData.displayValue, indicator.units)}
          </h1>
          <div>
            <h4>{indicator.label?.toUpperCase() || ''}</h4>
            <h4>{dateToQuarter(indicatorTrendData.currentDate, 'QX YYYY')}</h4>
          </div>
        </div>
        <InfoIcon variableDescription={indicator.label} />
      </div>
      <TrendPill
        currentValue={indicatorTrendData.currentValue}
        compareValue={indicatorTrendData.compareValue}
        compareDate={indicatorTrendData.compareDate}
        units={indicator.units}
        positiveTrendDirection={indicator.positiveTrendDirection}
        data={data[indicator.key]}
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

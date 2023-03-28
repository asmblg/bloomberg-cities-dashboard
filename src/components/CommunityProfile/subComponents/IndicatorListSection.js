import React from 'react';
import PropTypes from 'prop-types';

// import TrendPill from '../../TrendPill';

import infoIcon from '../../../assets/icons/info.png';
import formatNumberWithCommas from '../../../utils/formatNumberWithCommas';
import getMostRecentDateKeys from '../../../utils/getMostRecentDateKeys';
import calculateInversePercent from '../../../utils/calculateInversePercent';
import addPercentages from '../../../utils/addPercentages';

const IndicatorListSection = ({ config, data }) => {
  // const trendVal = null;
  const handleCalculationAndLabel = ({ calculation, allData, key, labelFormatter }) => {
    if (allData && allData[key]) {
      const indicatorData = allData[key];
      const [mostRecentDate] = getMostRecentDateKeys(Object.keys(indicatorData), 1);
      let num = indicatorData[mostRecentDate];

      // Calculate value to display
      if (calculation && calculation.type) {
        const otherVal = allData[calculation.helperIndicator]?.[mostRecentDate] || null;
        switch (calculation.type) {
          case 'inversePercent': {
            if (otherVal) {
              num = calculateInversePercent(num, otherVal);
            }
            break;
          }
          case 'addPercentages': {
            if (otherVal) {
              num = addPercentages(num, otherVal, 1);
            }
            break;
          }
          default: {
            break;
          }
        }
      }
      // Add commas to numbers 1000 and over
      num = formatNumberWithCommas(num);
      // Format Label
      if (labelFormatter) {
        switch (labelFormatter) {
          case 'numToDollars': {
            num = `$${num}.00`;
            break;
          }
          case 'percent': {
            num = `${num}%`;
            break;
          }
          default: {
            break;
          }
        }
      }
      return num || '-';
    }
    return '-';
  };
  return config.lists && config.lists[0]
    ? config.lists.map(({ type, indicators }, i) => (
      <div key={`data-wrapper-${type}-${i}`} className='cp-data-wrapper'>
        {type === 'grid' && indicators && indicators[0] ? (
          <div key={`indicator-list-${type}-${i}`} className='large-indicator-values-container'>
            {indicators.map(({ key, text, calculation, labelFormatter }, i) => (
              <div key={`large-ind-val-${key}-${i}`} className='large-indicator-value'>
                <div className='title-info-container'>
                  <h5>{text.toUpperCase()}</h5>
                  <img className='info-icon' src={infoIcon} />
                </div>
                <h2 className='bold-font'>
                  {handleCalculationAndLabel({
                    allData: data || null,
                    key,
                    calculation,
                    labelFormatter
                  })}
                </h2>
              </div>
            ))}
          </div>
        ) : type === 'horizontal-containers-with-trend' && indicators && indicators[0] ? (
          indicators.map(({ key, text, calculation, labelFormatter }) => (
            <div key={`horizontal-container-indicator-${key}-${i}`}>
              <div className='horizontal-percentage-indicator'>
                <h2 className='bold-font'>
                  {handleCalculationAndLabel({
                    allData: data || null,
                    key,
                    calculation,
                    labelFormatter
                  })}
                </h2>
                <h5>{text}</h5>
                {/* No data for comparison */}
                {/* <TrendPill direction={'up'} value={'+ XX.X%'} height={30} width={190} /> */}
              </div>
            </div>
          ))
        ) : null}
      </div>
    ))
    : null;
};

IndicatorListSection.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object
};

export default IndicatorListSection;

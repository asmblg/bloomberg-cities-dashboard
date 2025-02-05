import React from 'react';
import PropTypes from 'prop-types';

import TrendPill from '../../TrendPill';
// import InfoIcon from '../../InfoIcon';

import { handleCalculator } from '../utils';
import addCalculatedIndicatorToDataObj from '../../../utils/addCalculatedIndicatorToDataObj';
import formatValue from '../../../utils/formatValue';

const IndicatorListSection = ({ config, data, yearKeys }) => {
  return data && yearKeys?.[0] && config.lists && config.lists[0]
    ? config.lists.map(({ type, indicators }, i) => (
      <div key={`data-wrapper-${type}-${i}`} className='cp-data-wrapper'>
        {type === 'grid' && indicators && indicators[0] ? (
          <div key={`indicator-list-${type}-${i}`} className='large-indicator-values-container'>
            {indicators.map((indicator, ii) => {
              const calculatedData = indicator.calculator
                ? addCalculatedIndicatorToDataObj(indicator, data[yearKeys[0]])
                : data[yearKeys[0]];
              const value = calculatedData?.[indicator.key] || null;

              return indicator.label ? (
                <div
                  key={`large-ind-val-${indicator.key}-${ii}`}
                  className='large-indicator-value'
                >
                  <div className='title-info-container'>
                    <h5>{indicator.label.toUpperCase() || ''}</h5>
                    {/* <InfoIcon config={indicator} /> */}
                  </div>
                  <h2 className='bold-font'>{formatValue(value, indicator.units)}</h2>
                </div>
              ) : null;
            })}
          </div>
        ) : type === 'horizontal-containers-with-trend' && indicators && indicators[0] ? (
          <div style={{width: 'fit-content'}}>
            <div className='horizontal-containers-with-trend-header'>
              <div>
                <div>Change</div>
                <div>{yearKeys?.[1] || '?'}-{yearKeys?.[0] || '?'}</div>
              </div>
            </div>
            {
              indicators.map((indicator, ii) => {
                const currentValue = handleCalculator(data[yearKeys[0]], indicator);
                const compareValue = yearKeys[1] ? handleCalculator(data[yearKeys[1]], indicator) : null;

                return (
                  <div
                    key={`horizontal-container-indicator-${indicator.key}-${ii}`}
                    className='horizontal-percentage-indicator'
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center'}}>
                      <h3 className='bold-font'>{formatValue(currentValue, indicator.units)}</h3>
                      <h5 style={{marginLeft: '10px'}}>{indicator.label || ''}</h5>
                    </div>
                    <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                      <TrendPill
                        currentValue={currentValue}
                        compareValue={compareValue}
                        compareDate={yearKeys[1]}
                        units={indicator.units}
                        positiveTrendDirection={indicator.positiveTrendDirection}
                        // displayCompareText
                      />
                      {/* <InfoIcon config={indicator} /> */}
                    </div>
                  </div>
                );
              })
            }
          </div>
        ) : null}
      </div>
    ))
    : null;
};

IndicatorListSection.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  yearKeys: PropTypes.array
};

export default IndicatorListSection;

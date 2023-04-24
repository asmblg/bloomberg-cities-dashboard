import React from 'react';
import PropTypes from 'prop-types';

// import TrendPill from '../../TrendPill';
import InfoIcon from '../../InfoIcon';

import addCalculatedIndicatorToDataObj from '../../../utils/addCalculatedIndicatorToDataObj';
import formatValue from '../../../utils/formatValue';

const IndicatorListSection = ({ config, data }) => {
  return data && config.lists && config.lists[0]
    ? config.lists.map(({ type, indicators }, i) => (
      <div key={`data-wrapper-${type}-${i}`} className='cp-data-wrapper'>
        {type === 'grid' && indicators && indicators[0] ? (
          <div key={`indicator-list-${type}-${i}`} className='large-indicator-values-container'>
            {indicators.map((indicator, ii) => {
              const calculatedData = indicator.calculator
                ? addCalculatedIndicatorToDataObj(indicator, data)
                : data;
              const value = calculatedData?.[indicator.key] || null;

              return indicator.label ? (
                <div
                  key={`large-ind-val-${indicator.key}-${ii}`}
                  className='large-indicator-value'
                >
                  <div className='title-info-container'>
                    <h5>{indicator.label.toUpperCase() || ''}</h5>
                    <InfoIcon config={indicator} />
                  </div>
                  <h2 className='bold-font'>{formatValue(value, indicator.units)}</h2>
                </div>
              ) : null;
            })}
          </div>
        ) : type === 'horizontal-containers-with-trend' && indicators && indicators[0] ? (
          indicators.map((indicator, ii) => {
            const calculatedData = indicator.calculator
              ? addCalculatedIndicatorToDataObj(indicator, data)
              : data;
            const value = calculatedData?.[indicator.key];

            return (
              <div key={`horizontal-container-indicator-${indicator.key}-${ii}`}>
                <div className='horizontal-percentage-indicator'>
                  <h2 className='bold-font'>{formatValue(value, indicator.units)}</h2>
                  <div style={{ display: 'flex', justifyItems: 'center' }}>
                    <h5>{indicator.label || ''}</h5>
                    <InfoIcon config={indicator} />
                  </div>
                  {/* No data for comparison */}
                  {/* <TrendPill direction={'up'} value={'+ XX.X%'} height={30} width={190} /> */}
                </div>
              </div>
            );
          })
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

import React from 'react';
import PropTypes from 'prop-types';

// import TrendPill from '../../TrendPill';
import InfoIcon from '../../InfoIcon';

import { handleValueCalculationAndFormatting } from '../utils';

const IndicatorListSection = ({ config, data, dataManifest }) => {
  return config.lists && config.lists[0]
    ? config.lists.map(({ type, indicators }, i) => (
      <div key={`data-wrapper-${type}-${i}`} className='cp-data-wrapper'>
        {type === 'grid' && indicators && indicators[0] ? (
          <div key={`indicator-list-${type}-${i}`} className='large-indicator-values-container'>
            {indicators.map((key, i) => {
              const indicatorConfig = dataManifest.indicators[key];
              return (
                <div key={`large-ind-val-${key}-${i}`} className='large-indicator-value'>
                  <div className='title-info-container'>
                    <h5>{indicatorConfig?.short_name.toUpperCase() || ''}</h5>
                    <InfoIcon source={'A good source'} variableDescription={'A great description...'} />
                  </div>
                  <h2 className='bold-font'>
                    {handleValueCalculationAndFormatting({
                      allData: data || null,
                      indicatorConfig,
                      key
                    })}
                  </h2>
                </div>
              );
            })}
          </div>
        ) : type === 'horizontal-containers-with-trend' && indicators && indicators[0] ? (
          indicators.map((key, j) => {
            const indicatorConfig = dataManifest.indicators[key];
            return (
              <div key={`horizontal-container-indicator-${key}-${j}`}>
                <div className='horizontal-percentage-indicator'>
                  <h2 className='bold-font'>
                    {handleValueCalculationAndFormatting({
                      allData: data || null,
                      key,
                      indicatorConfig
                    })}
                  </h2>
                  <div style={{display: 'flex', justifyItems: 'center'}}>
                    <h5>{indicatorConfig.long_name || ''}</h5>
                    <InfoIcon source={'The Source Spot'} />
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
  data: PropTypes.object,
  dataManifest: PropTypes.object
};

export default IndicatorListSection;

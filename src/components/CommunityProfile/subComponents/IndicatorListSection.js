import React from 'react';
import PropTypes from 'prop-types';

// import TrendPill from '../../TrendPill';

import infoIcon from '../../../assets/icons/info.png';
import getIndicatorConfigFromManifest from '../../../utils/getIndicatorConfigFromManifest';
import { handleValueCalculationAndFormatting } from '../utils';

const IndicatorListSection = ({ config, data, dataManifest }) => {
  return config.lists && config.lists[0]
    ? config.lists.map(({ type, indicators }, i) => (
      <div key={`data-wrapper-${type}-${i}`} className='cp-data-wrapper'>
        {type === 'grid' && indicators && indicators[0] ? (
          <div key={`indicator-list-${type}-${i}`} className='large-indicator-values-container'>
            {indicators.map((key, i) => {
              const indicatorConfig = getIndicatorConfigFromManifest(dataManifest, key);
              return (
                <div key={`large-ind-val-${key}-${i}`} className='large-indicator-value'>
                  <div className='title-info-container'>
                    <h5>{indicatorConfig?.short_name.toUpperCase() || ''}</h5>
                    <img className='info-icon' src={infoIcon} />
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
            const indicatorConfig = getIndicatorConfigFromManifest(dataManifest, key);
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
                  <h5>{indicatorConfig.long_name || ''}</h5>
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
  dataManifest: PropTypes.array
};

export default IndicatorListSection;
